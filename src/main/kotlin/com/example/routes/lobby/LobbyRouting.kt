package com.example.routes.lobby

import com.example.engine.game.Game
import com.example.engine.game.GameSettings
import com.example.engine.game.Player
import com.example.engine.store.GameStore
import com.example.engine.store.getGame
import com.example.routes.CustomStatusCodeException
import com.example.routes.websocket.SocketService
import com.example.routes.websocket.message.GameStateChanged
import com.example.routes.websocket.message.PlayersChanged
import com.example.session.GameSession
import com.example.session.getPlayerId
import com.example.session.isHost
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.sessions.*
import io.ktor.util.pipeline.*
import java.util.*

fun Routing.lobby() {
    route("api/lobby") {
        get("in-a-game") {
            val game = call.getGame()
            call.respond(game != null)
        }

        get("host") {
            val game = call.getGame()
            game ?: throw NotFoundException()

            val playerId = call.getPlayerId()
            playerId ?: throw NotFoundException()

            call.respond(game.host.id == playerId)
        }

        get("invite-id") {
            val game = call.getGame()
            game ?: throw BadRequestException("You can not invite others if you did not create a game yet")
            if (game.state != Game.State.WAITING_TO_START) {
                throw BadRequestException("You can not invite others if you did not create a game yet")
            }
            call.respond(game.id)
        }

        get("players") {
            val game = call.getGame()
            game ?: throw BadRequestException("Not in a game")
            val players = game.playerList.map { PlayerAnswer(it, call.getPlayerId()!!) }
            call.respond(players)
        }

        post("host") {
            val (playerId, game) = createGame()
            call.sessions.set(GameSession(playerId, game.id))
            call.response.status(HttpStatusCode.Created)
        }

        post("join") {
            val joinRequest = call.receive<JoinRequest>()
            val oldGame = call.getGame()
            if (oldGame != null) {
                throw BadRequestException("Leave the old game before joining a new one")
            }
            val game = GameStore.getInstance().getGame(joinRequest.gameId)
            if (game == null) {
                call.respond(HttpStatusCode.NotFound, "No such game was found")
                return@post
            }
            if (game.hasPlayer(joinRequest.playerName)) {
                call.respond(HttpStatusCode.BadRequest, "This player name is already taken")
                return@post
            }
            if (game.state != Game.State.WAITING_TO_START) {
                call.respond(HttpStatusCode.BadRequest, "Game is a state that it can not be joined any longer")
                return@post
            }
            val playerId = joinGame(game, joinRequest)
            call.sessions.set(GameSession(playerId, game.id))
            call.response.status(HttpStatusCode.Created)
            SocketService.sendToAllInGame(game.id, PlayersChanged())
        }

        post("start") {
            val host = call.isHost()
            if(host == null || !host){
                throw CustomStatusCodeException(HttpStatusCode.Forbidden, "Can only start as host")
            }
            val game = call.getGame()
            game?: throw IllegalStateException()
            val startRequest = call.receive<StartRequest>()
            game.start(GameSettings(startRequest))
            SocketService.sendToAllInGame(game.id, PlayersChanged())
            SocketService.sendToAllInGame(game.id, GameStateChanged(Game.State.EXPLAIN.name))
            call.respond(HttpStatusCode.OK, "started")
        }
    }
}

private fun joinGame(
    game: Game,
    hostRequest: JoinRequest
): String {
    val playerId = UUID.randomUUID().toString()
    game.join(Player(hostRequest.playerName, playerId, host = false, connected = false))
    return playerId
}

private suspend fun PipelineContext<Unit, ApplicationCall>.createGame(): Pair<String, Game> {
    val hostRequest = call.receive<HostRequest>()
    val gameId = UUID.randomUUID().toString()
    val playerId = UUID.randomUUID().toString()
    val game = Game(gameId, Player(hostRequest.name, playerId, host = true, connected = false))
    GameStore.getInstance().save(game)
    return Pair(playerId, game)
}
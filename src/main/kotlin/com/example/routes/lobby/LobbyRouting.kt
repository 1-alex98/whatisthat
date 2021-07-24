package com.example.routes.lobby

import com.example.engine.game.Game
import com.example.engine.game.Player
import com.example.engine.store.GameStore
import com.example.engine.store.getGame
import com.example.routes.websocket.SocketService
import com.example.routes.websocket.message.PlayerJoined
import com.example.session.GameSession
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.http.cio.websocket.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.sessions.*
import io.ktor.util.pipeline.*
import io.ktor.websocket.*
import kotlinx.coroutines.channels.Channel
import java.util.*

fun Routing.lobby() {
    route("api/lobby") {
        get("in-a-game") {
            val game = call.getGame()
            call.respond(game != null)
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
            val players = game.playerList.map { PlayerAnswer(it) }
            call.respond(players)
        }

        post("host") {
            val (playerId, game) = createGame()
            call.sessions.set(GameSession(playerId, game.id))
            call.response.status(HttpStatusCode.Created)
        }

        post("join") {
            val hostRequest = call.receive<JoinRequest>()
            val oldGame = call.getGame()
            if(oldGame != null){
                throw BadRequestException("Leave the old game before joining a new one")
            }
            val game = GameStore.getInstance().getGame(hostRequest.gameId)
            game ?: run {
                call.respond(HttpStatusCode.NotFound, "No such game was found")
                return@post
            }
            val playerId = joinGame(game, hostRequest)
            call.sessions.set(GameSession(playerId, game.id))
            call.response.status(HttpStatusCode.Created)
            SocketService.sendToAllInGame(game.id, PlayerJoined())
        }
    }
}

private fun joinGame(
    game: Game,
    hostRequest: JoinRequest
): String {
    val playerId = UUID.randomUUID().toString()
    game.join(Player(hostRequest.playerName, playerId))
    return playerId
}

private suspend fun PipelineContext<Unit, ApplicationCall>.createGame(): Pair<String, Game> {
    val hostRequest = call.receive<HostRequest>()
    val gameId = UUID.randomUUID().toString()
    val playerId = UUID.randomUUID().toString()
    val game = Game(gameId, Player(hostRequest.name, playerId))
    GameStore.getInstance().save(game)
    return Pair(playerId, game)
}
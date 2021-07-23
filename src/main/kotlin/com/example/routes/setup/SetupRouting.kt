package com.example.routes.setup

import com.example.engine.game.Game
import com.example.engine.game.Player
import com.example.engine.store.GameStore
import com.example.engine.store.getGame
import com.example.session.GameSession
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.sessions.*
import io.ktor.util.pipeline.*
import java.util.*

fun Routing.setup() {
    get("api/game/in-a-game"){
        val game = call.getGame()
        call.respond(game != null)
    }

    get("api/game/invite-id"){
        val game = call.getGame()
        game ?: throw BadRequestException("You can not invite others if you did not create a game yet")
        if(game.state != Game.State.WAITING_TO_START){
            throw BadRequestException("You can not invite others if you did not create a game yet")
        }
        call.respond(game.id)
    }

    post("api/game/host") {
        val (playerId, game) = createGame()
        call.sessions.set(GameSession(playerId, game.id))
        call.response.status(HttpStatusCode.Created)
    }

    post ("api/game/join") {
        val hostRequest = call.receive<JoinRequest>()
        val game = GameStore.getInstance().getGame(hostRequest.gameId)
        game ?: run {
            call.respond(HttpStatusCode.NotFound, "No such game was found")
            return@post
        }
        val playerId = joinGame(game, hostRequest)
        call.sessions.set(GameSession(playerId, game.id))
        call.response.status(HttpStatusCode.Created)
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
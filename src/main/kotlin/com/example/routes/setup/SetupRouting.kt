package com.example.routes.setup

import com.example.engine.game.Game
import com.example.engine.game.Player
import com.example.engine.store.InMemoryGameStore
import com.example.engine.store.getGame
import com.example.session.GameSession
import io.ktor.application.*
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

    get("api/game/invite-url"){
        val game = call.getGame()
        call.respond(game != null)
    }

    post("api/game/host") {
        val (playerId, game) = createGame()
        call.sessions.set(GameSession(playerId, game.id))
        call.response.status(HttpStatusCode.Created)
    }

    post ("api/game/join") {

    }
}

private suspend fun PipelineContext<Unit, ApplicationCall>.createGame(): Pair<String, Game> {
    val hostRequest = call.receive<HostRequest>()
    val gameId = UUID.randomUUID().toString()
    val playerId = UUID.randomUUID().toString()
    val game = Game(gameId, Player(hostRequest.name, playerId))
    InMemoryGameStore.save(game)
    return Pair(playerId, game)
}
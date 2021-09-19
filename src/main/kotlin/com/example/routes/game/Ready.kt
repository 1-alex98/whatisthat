package com.example.routes.game

import com.example.engine.game.Game
import com.example.engine.store.getExistingGame
import com.example.engine.store.getExistingPlayer
import com.example.routes.CustomStatusCodeException
import com.example.routes.websocket.SocketService
import com.example.routes.websocket.message.PlayersReadyChanged
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*

fun Route.ready() {
    get("ready-missing") {
        val game = call.getExistingGame()
        call.respond(game.playerList.filter { !it.ready }.map { it.name })
    }

    post("ready") {
        call.getExistingPlayer().ready = true
        val existingGame = call.getExistingGame()
        SocketService.sendToAllInGame(existingGame.id, PlayersReadyChanged())
        if (existingGame.allReady()) {
            if (existingGame.state == Game.State.EXPLAIN) {
                existingGame.startFirstRound()
            } else if (existingGame.state == Game.State.REVIEW) {
                existingGame.nextRoundOrVote()
            }
        }
        call.respond(HttpStatusCode.OK)
    }
}

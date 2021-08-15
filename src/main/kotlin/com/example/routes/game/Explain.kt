package com.example.routes.game

import com.example.engine.game.Game
import com.example.engine.store.getExistingGame
import com.example.engine.store.getExistingPlayer
import com.example.routes.CustomStatusCodeException
import com.example.routes.websocket.SocketService
import com.example.routes.websocket.message.GameStateChanged
import com.example.routes.websocket.message.PlayersReadyChanged
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*

fun Route.explain() {
    get("role") {
        val existingPlayer = call.getExistingPlayer()
        val message = existingPlayer.role
        message ?: throw CustomStatusCodeException(HttpStatusCode.Conflict.value)
        call.respond(message)
    }

    get("rounds") {
        val game = call.getExistingGame()
        val settings = game.settings
        settings ?: throw CustomStatusCodeException(HttpStatusCode.Conflict.value)
        call.respond(settings.rounds)
    }

    get("ready-missing") {
        val game = call.getExistingGame()
        call.respond(game.playerList.filter { !it.ready }.map { it.name })
    }

    post("ready") {
        call.getExistingPlayer().ready = true
        val existingGame = call.getExistingGame()
        SocketService.sendToAllInGame(existingGame.id, PlayersReadyChanged())
        if (existingGame.allReady()) {
            existingGame.startFirstRound()
        }
        call.respond(HttpStatusCode.OK)
    }
}

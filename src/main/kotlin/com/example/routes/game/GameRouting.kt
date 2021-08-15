package com.example.routes.game

import com.example.engine.game.Game
import com.example.engine.game.Player
import com.example.engine.store.GameStore
import com.example.engine.store.getExistingGame
import com.example.engine.store.getExistingPlayer
import com.example.engine.store.getGame
import com.example.routes.CustomStatusCodeException
import com.example.routes.websocket.SocketService
import com.example.routes.websocket.message.PlayersChanged
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

fun Routing.game() {
    route("api/game") {
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
    }
}

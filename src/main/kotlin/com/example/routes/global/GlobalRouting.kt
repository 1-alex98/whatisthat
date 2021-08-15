package com.example.routes.global

import com.example.engine.game.Game
import com.example.engine.game.Player
import com.example.engine.store.GameStore
import com.example.engine.store.getGame
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

fun Routing.global() {
    route("api/global") {
        get("game-state") {
            val game = call.getGame()
            if(game == null){
                call.respond("")
                return@get
            }
            call.respond(game.state.name)
        }
    }
}

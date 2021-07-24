package com.example.plugins

import com.example.routes.lobby.lobby
import com.example.routes.websocket.websocket
import io.ktor.routing.*
import io.ktor.application.*

fun Application.routing() {
    routing {
        lobby()
        websocket()
    }
}

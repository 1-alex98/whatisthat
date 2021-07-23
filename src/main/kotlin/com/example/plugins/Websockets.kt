package com.example.plugins

import com.example.session.GameSession
import io.ktor.sessions.*
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*
import io.ktor.websocket.*

fun Application.configureWebsockets() {
    install(WebSockets)
}

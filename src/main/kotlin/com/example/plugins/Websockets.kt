package com.example.plugins

import com.example.session.GameSession
import io.ktor.sessions.*
import io.ktor.application.*
import io.ktor.http.cio.websocket.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*
import io.ktor.websocket.*
import java.time.Duration

fun Application.configureWebsockets() {
    install(WebSockets){
        pingPeriod = Duration.ofSeconds(10)
        timeout = Duration.ofSeconds(15)

    }
}

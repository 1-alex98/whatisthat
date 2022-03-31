package com.example.plugins

import com.example.session.GameSession
import io.ktor.sessions.*
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*

fun Application.configureSession() {
    install(Sessions) {
        cookie<GameSession>("GAME_SESSION", storage = SessionStorageMemory()){
            cookie.extensions["SameSite"] = "strict"
            cookie.maxAgeInSeconds = 60 * 60 * 24* 60
        }
    }
}

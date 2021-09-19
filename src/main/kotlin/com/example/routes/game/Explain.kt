package com.example.routes.game

import com.example.engine.store.getExistingGame
import com.example.engine.store.getExistingPlayer
import com.example.routes.CustomStatusCodeException
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*

fun Route.explain() {
    get("role") {
        val existingPlayer = call.getExistingPlayer()
        val message = existingPlayer.role
        message ?: throw CustomStatusCodeException(HttpStatusCode.Conflict, "You have no role")
        call.respond(message)
    }

    get("rounds") {
        val game = call.getExistingGame()
        val settings = game.settings
        settings ?: throw CustomStatusCodeException(HttpStatusCode.Conflict, "Settings missing")
        call.respond(settings.rounds)
    }


}

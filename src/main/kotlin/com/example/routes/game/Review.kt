package com.example.routes.game

import com.example.engine.game.Game
import com.example.engine.store.getExistingGame
import com.example.engine.store.getExistingPlayer
import com.example.engine.store.isImpostor
import com.example.routes.CustomStatusCodeException
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

fun Route.review() {
    get("sentence-review") {
        val existingGame = call.getExistingGame()
        if (existingGame.state != Game.State.REVIEW) {
            throw CustomStatusCodeException(HttpStatusCode.Forbidden, "Can only be accessed in game state review")
        }
        call.respond(existingGame.rounds.last().sentence.asStringComplete())
    }

    get("review-time") {
        val existingGame = call.getExistingGame()
        call.respond(existingGame.settings!!.secondsDiscussing)
    }

    get("review-images") {
        val existingGame = call.getExistingGame()
        val currentRound = existingGame.rounds.last()
        val images = currentRound.images.map {
            ImageResponse(existingGame.getNameFromId(it.key), it.value)
        }.toSet()
        call.respond(images)
    }

    post("hack-crew-member") {
        if (!call.isImpostor()) {
            throw CustomStatusCodeException(HttpStatusCode.Forbidden, "Must be impostor")
        }
        val existingGame = call.getExistingGame()
        val impostorActions = existingGame.impostorActionsLeft!!
        if (impostorActions.impostorHacking <= 0) {
            throw CustomStatusCodeException(HttpStatusCode.Forbidden, "Already used up action")
        }
        val currentRound = existingGame.rounds.last()
        val playerName = call.receive<String>()
        val id = existingGame.playerList.filter { it.name == playerName }.first().id
        if (currentRound.hackedPlayerIdNextRound != id) {
            currentRound.hackedPlayerIdNextRound = id
            impostorActions.impostorHacking = impostorActions.impostorHacking - 1
        }
        call.respond(HttpStatusCode.Created)
    }
}

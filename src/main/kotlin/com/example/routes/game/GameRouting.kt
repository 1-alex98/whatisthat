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

fun Routing.game() {
    route("api/game") {
        explain()
        draw()
        ready()
        review()
    }
}

private fun Route.review() {
    get("sentence-review") {
        val existingGame = call.getExistingGame()
        if (existingGame.state != Game.State.REVIEW) {
            throw CustomStatusCodeException(403, "Can only be accessed in game state review")
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
}

private fun Route.ready() {
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



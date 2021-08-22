package com.example.routes.game

import com.example.engine.game.Game
import com.example.engine.store.getExistingGame
import com.example.engine.store.isAlien
import com.example.routes.CustomStatusCodeException
import com.example.routes.websocket.SocketService
import com.example.routes.websocket.message.GameStateChanged
import com.example.routes.websocket.message.Message
import com.example.routes.websocket.message.PlayersReadyChanged
import com.example.session.getExistingPlayerId
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

fun Routing.game() {
    route("api/game") {
        explain()
        draw()
    }
}

private fun Route.draw() {
    get("sentence-crew") {
        if (call.isAlien()) {
            throw CustomStatusCodeException(403, "")
        }
        val existingGame = call.getExistingGame()
        val last = existingGame.rounds.last()
        call.respond(last.sentence.asStringComplete())
    }

    get("sentence-alien") {
        val existingGame = call.getExistingGame()
        val last = existingGame.rounds.last()
        call.respond(last.sentence.asStringHidden())
    }

    get("draw-time") {
        val existingGame = call.getExistingGame()
        call.respond(existingGame.settings!!.secondsDrawing)
    }

    post("upload-image") {
        val existingGame = call.getExistingGame()
        val currentRound = existingGame.rounds
            .last()
        currentRound
            .addImage(call.getExistingPlayerId(), call.receive())
        if (currentRound.getMissingPlayers(existingGame.playerIds()).isEmpty()) {
            existingGame.state = Game.State.REVIEW
            SocketService.sendToAllInGame(existingGame.id, GameStateChanged(Game.State.REVIEW.name))
        } else {
            SocketService.sendToAllInGame(existingGame.id, PlayersReadyChanged())
        }

        call.respond(HttpStatusCode.Created)
    }

    get("upload-missing") {
        val existingGame = call.getExistingGame()
        val missingPlayerIds = existingGame.rounds.last().getMissingPlayers(existingGame.playerIds())
        val missingPlayerNames = existingGame.playerList.filter { missingPlayerIds.contains(it.id) }.map { it.name }
        call.respond(missingPlayerNames)
    }
}


package com.example.routes.game

import com.example.engine.game.Game
import com.example.engine.store.getExistingGame
import com.example.engine.store.isImpostor
import com.example.routes.CustomStatusCodeException
import com.example.routes.websocket.SocketService
import com.example.routes.websocket.message.GameStateChanged
import com.example.routes.websocket.message.PlayersReadyChanged
import com.example.session.getExistingPlayerId
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*

fun Route.draw() {
    get("sentence-crew") {
        if (call.isImpostor()) {
            throw CustomStatusCodeException(403, "")
        }
        val existingGame = call.getExistingGame()
        val playerId = call.getExistingPlayerId()
        val penultimateRound = existingGame.penultimateRound()
        val currentRound = existingGame.rounds.last()
        if (penultimateRound?.hackedPlayerIdNextRound != playerId) {
            call.respond(currentRound.sentence.asStringComplete())
        } else {
            call.respond(currentRound.sentence.asHackedSentence())
        }
    }

    get("sentence-impostor") {
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

    get("full-sentence-impostor"){
        if(!call.isImpostor()){
            throw CustomStatusCodeException(403, "Must be impostor")
        }
        val existingGame = call.getExistingGame()
        val currentRound = existingGame.rounds.last()
        if(currentRound.impostorKnowsFullSentence){
            call.respond(currentRound.sentence.asStringComplete())
            return@get
        }
        val impostorActionsLeft = existingGame.impostorActionsLeft!!
        if(impostorActionsLeft.impostorGetsCompleteSentence <=0){
            throw CustomStatusCodeException(400, "Action already used up")
        }
        impostorActionsLeft.impostorGetsCompleteSentence = impostorActionsLeft.impostorGetsCompleteSentence - 1
        currentRound.impostorKnowsFullSentence = true
        call.respond(currentRound.sentence.asStringComplete())
    }

    get("full-sentence-impostor-active"){
        if(!call.isImpostor()){
            throw CustomStatusCodeException(403, "Must be impostor")
        }
        val existingGame = call.getExistingGame()
        val currentRound = existingGame.rounds.last()
        call.respond(currentRound.impostorKnowsFullSentence)
    }
}
package com.example.routes.game

import com.example.engine.game.Game
import com.example.engine.store.getExistingGame
import com.example.engine.store.getExistingPlayer
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

fun Routing.game() {
    route("api/game") {
        explain()
        draw()
        ready()
        review()
        get("votable-players") {
            val existingGame = call.getExistingGame()
            val votablePlayerNames = existingGame.playerList.filter { it.id != call.getExistingPlayerId() }
                .map { it.name }
            call.respond(votablePlayerNames)
        }

        post("vote"){
            val existingGame = call.getExistingGame()
            val receive = call.receive<String>()
            val existingPlayer = call.getExistingPlayer()
            if(existingPlayer.voted) {
                throw CustomStatusCodeException(403, "Already voted")
            }
            existingPlayer.voted= true
            existingGame.playerList.find{ it.name == receive }!!.votedFor++
            existingPlayer.ready = true
            if(existingGame.allReady()){
                existingGame.state = Game.State.RESULT
                SocketService.sendToAllInGame(existingGame.id, GameStateChanged(Game.State.RESULT.name))
            }
            call.respond(HttpStatusCode.Created)
        }

        get("impostor"){
            val existingGame = call.getExistingGame()
            if(existingGame.state != Game.State.RESULT){
                throw CustomStatusCodeException(403, "Game must be finished")
            }
            call.respond(existingGame.playerList.find { it.role == "impostor" }!!.name)
        }

        get("winner"){
            val existingGame = call.getExistingGame()
            if(existingGame.state != Game.State.RESULT){
                throw CustomStatusCodeException(403, "Game must be finished")
            }
            val maxVote = existingGame.playerList.maxOf { it.votedFor }
            val playersVoted = existingGame.playerList.filter { it.votedFor == maxVote }
            if(playersVoted.size > 1){
                call.respond("impostor")
            } else {
                if(playersVoted[0].role == "impostor"){
                    call.respond("crew")
                }else{
                    call.respond("impostor")
                }
            }
        }
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



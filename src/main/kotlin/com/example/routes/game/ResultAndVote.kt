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

fun Route.resultAndVote() {

    get("votable-players") {
        val existingGame = call.getExistingGame()
        val votablePlayerNames = existingGame.playerList.filter { it.id != call.getExistingPlayerId() }
            .map { it.name }
        call.respond(votablePlayerNames)
    }

    post("vote") {
        val existingGame = call.getExistingGame()
        val receive = call.receive<String>()
        val existingPlayer = call.getExistingPlayer()
        if (existingPlayer.voted) {
            throw CustomStatusCodeException(HttpStatusCode.Forbidden, "Already voted")
        }
        existingPlayer.voted = true
        val find = existingGame.playerList.find { it.name == receive }
        find!!.votedFor++
        existingPlayer.ready = true
        SocketService.sendToAllInGame(existingGame.id, PlayersReadyChanged())
        if (existingGame.allReady()) {
            existingGame.state = Game.State.RESULT
            SocketService.sendToAllInGame(existingGame.id, GameStateChanged(Game.State.RESULT.name))
        }
        call.respond(HttpStatusCode.Created)
    }

    get("impostor") {
        val existingGame = call.getExistingGame()
        if (existingGame.state != Game.State.RESULT) {
            throw CustomStatusCodeException(HttpStatusCode.Forbidden, "Game must be finished")
        }
        call.respond(existingGame.playerList.find { it.role == "impostor" }!!.name)
    }

    get("winner") {
        val existingGame = call.getExistingGame()
        if (existingGame.state != Game.State.RESULT) {
            throw CustomStatusCodeException(HttpStatusCode.Forbidden, "Game must be finished")
        }
        val maxVote = existingGame.playerList.maxOf { it.votedFor }
        val playersVoted = existingGame.playerList.filter { it.votedFor == maxVote }
        if (playersVoted.size > 1) {
            call.respond("impostor")
        } else {
            if (playersVoted[0].role == "impostor") {
                call.respond("crew")
            } else {
                call.respond("impostor")
            }
        }
    }

    get("vote-data") {
        val existingGame = call.getExistingGame()
        if (existingGame.state != Game.State.RESULT) {
            throw CustomStatusCodeException(HttpStatusCode.Forbidden, "Game must be finished")
        }
        val data = existingGame.playerList.map { PlayerVoteDataResponse(it.name, it.votedFor) }
        call.respond(data)
    }
}
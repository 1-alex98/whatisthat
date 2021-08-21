package com.example.engine.store

import com.example.engine.game.Game
import com.example.engine.game.Player
import com.example.session.GameSession
import com.example.session.getExistingPlayerId
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.sessions.*


fun ApplicationCall.getGame(): Game?{
    val session = sessions.get<GameSession>() ?: return null
    return GameStore.getInstance().getGame(session.gameId)
}

fun ApplicationCall.getExistingGame(): Game{
    val session = sessions.get<GameSession>() ?: throw NotFoundException()
    return GameStore.getInstance().getGame(session.gameId)?: throw NotFoundException()
}

fun ApplicationCall.getExistingPlayer(): Player{
    val existingGame = getExistingGame()
    val playerId = getExistingPlayerId()
    return existingGame.playerList.find { it.id == playerId } ?: throw NotFoundException()
}

fun ApplicationCall.isAlien(): Boolean{
    return getExistingPlayer().role != "alien"
}

interface GameStore {
    fun save(game: Game)
    fun getGame(id: String): Game?
    companion object{
        fun getInstance(): GameStore{
            return InMemoryGameStore
        }
    }
}
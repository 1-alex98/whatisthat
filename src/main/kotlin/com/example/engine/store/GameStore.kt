package com.example.engine.store

import com.example.engine.game.Game
import com.example.session.GameSession
import io.ktor.application.*
import io.ktor.sessions.*


fun ApplicationCall.getGame(): Game?{
    val session = sessions.get<GameSession>() ?: return null
    return GameStore.getInstance().getGame(session.gameId)
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
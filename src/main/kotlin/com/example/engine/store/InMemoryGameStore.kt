package com.example.engine.store

import com.example.engine.game.Game
import com.example.session.GameSession
import io.ktor.application.*
import io.ktor.sessions.*


fun ApplicationCall.getGame(): Game?{
    val session = sessions.get<GameSession>() ?: return null
    return InMemoryGameStore.getGame(session.gameId)
}


object InMemoryGameStore: GameStore {

    val allGames: MutableSet<Game> = HashSet()

    override fun save(game: Game){
        allGames.add(game)
    }

    override fun getGame(id: String): Game?{
        return allGames.find { it.id == id }
    }
}
package com.example.engine.store

import com.example.engine.game.Game
import com.example.session.GameSession
import io.ktor.application.*
import io.ktor.sessions.*



object InMemoryGameStore: GameStore {

    val allGames: MutableSet<Game> = HashSet()

    override fun save(game: Game){
        allGames.add(game)
    }

    override fun getGame(id: String): Game?{
        return allGames.find { it.id == id }
    }
}
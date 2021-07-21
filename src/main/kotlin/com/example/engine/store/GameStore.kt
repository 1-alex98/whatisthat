package com.example.engine.store

import com.example.engine.game.Game
import io.ktor.application.*


interface GameStore {
    fun save(game: Game)
    fun getGame(id: String): Game?
}
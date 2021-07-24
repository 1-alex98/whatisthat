package com.example.session

import com.example.engine.game.Game
import com.example.engine.store.GameStore
import io.ktor.application.*
import io.ktor.sessions.*


fun ApplicationCall.getPlayerId(): String?{
    val session = sessions.get<GameSession>() ?: return null
    return session.playerId
}

data class GameSession(val playerId:String, val gameId: String)
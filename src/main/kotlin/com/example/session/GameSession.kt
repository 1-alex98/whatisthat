package com.example.session

import com.example.engine.game.Game
import com.example.engine.store.GameStore
import com.example.engine.store.getGame
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.sessions.*


fun ApplicationCall.getPlayerId(): String?{
    val session = sessions.get<GameSession>() ?: return null
    return session.playerId
}

fun ApplicationCall.getExistingPlayerId(): String{
    val session = sessions.get<GameSession>() ?: throw NotFoundException()
    return session.playerId
}

fun ApplicationCall.isHost(): Boolean?{
    val game = getGame()
    val playerId = getPlayerId()
    game?: return null
    playerId?: return null
    return game.host.id == playerId
}

data class GameSession(val playerId:String, val gameId: String)
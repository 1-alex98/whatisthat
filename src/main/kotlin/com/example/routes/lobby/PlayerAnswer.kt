package com.example.routes.lobby

import com.example.engine.game.Player
import kotlinx.serialization.Serializable

@Serializable
data class PlayerAnswer(val name:String, val host:Boolean, val connected:Boolean, val me: Boolean){
    constructor(player:Player, mePlayerId: String) : this(player.name, player.host, player.connected, player.id == mePlayerId)
}

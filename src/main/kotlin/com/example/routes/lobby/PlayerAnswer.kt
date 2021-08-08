package com.example.routes.lobby

import com.example.engine.game.Player
import kotlinx.serialization.Serializable

@Serializable
data class PlayerAnswer(val name:String, val host:Boolean, val connected:Boolean){
    constructor(player:Player) : this(player.name, player.host, player.connected)
}

package com.example.routes.lobby

import com.example.engine.game.Player
import kotlinx.serialization.Serializable

@Serializable
data class PlayerAnswer(val name:String){
    constructor(player:Player) : this(player.name)
}

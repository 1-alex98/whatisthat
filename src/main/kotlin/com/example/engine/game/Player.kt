package com.example.engine.game

class Player (val name:String, val id:String, val host: Boolean, var connected: Boolean) {
    var role: String? = null
    var ready: Boolean = false
    var voted: Boolean = false
    var votedFor = 0
}

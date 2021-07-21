package com.example.engine.game

class Game(val id: String, val host: Player){
    private val playerList: MutableList<Player> = ArrayList()

    init {
        playerList.add(host)
    }

    fun join(player: Player) {
        playerList.add(player)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Game

        if (id != other.id) return false

        return true
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}
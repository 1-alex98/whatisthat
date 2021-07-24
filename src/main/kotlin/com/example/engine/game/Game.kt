package com.example.engine.game

import io.ktor.features.*

class Game(val id: String, val host: Player){
    private val _playerList: MutableList<Player> = ArrayList()
    var state: State = State.WAITING_TO_START
    val playerList:List<Player>
        get() = _playerList.toList()

    init {
        _playerList.add(host)
    }

    fun join(player: Player) {
        if (state != State.WAITING_TO_START){
            throw BadRequestException("Can not join game that is not in state WAITING_TO_START")
        }
        _playerList.add(player)
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

    enum class State {
        WAITING_TO_START
    }
}
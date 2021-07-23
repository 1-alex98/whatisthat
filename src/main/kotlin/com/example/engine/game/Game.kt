package com.example.engine.game

import io.ktor.features.*
import io.ktor.http.*

class Game(val id: String, val host: Player){
    private val playerList: MutableList<Player> = ArrayList()
    var state: State = State.WAITING_TO_START

    init {
        playerList.add(host)
    }

    fun join(player: Player) {
        if (state != State.WAITING_TO_START){
            throw BadRequestException("Can not join game that is not in state WAITING_TO_START")
        }
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

    enum class State {
        WAITING_TO_START
    }
}
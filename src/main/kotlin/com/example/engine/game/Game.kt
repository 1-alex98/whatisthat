package com.example.engine.game

import com.example.engine.sentencegeneration.SentenceGenerator
import com.example.routes.websocket.SocketService
import com.example.routes.websocket.message.GameStateChanged
import io.ktor.features.*

class Game(val id: String, val host: Player){
    private val _playerList: MutableList<Player> = ArrayList()
    var state: State = State.WAITING_TO_START
    var settings: GameSettings? = null
    val rounds: MutableList<Round> = mutableListOf()

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

    fun assignRoles() {
        playerList.forEach { it.role = "crewmate"}
        playerList.random().role = "alien"
    }

    fun reset() {
        playerList.forEach{ it.ready = false}
        _playerList.removeIf{ !it.connected }
    }

    fun allReady(): Boolean {
        return playerList.find { !it.ready } == null
    }

    suspend fun startFirstRound() {
        state = State.DRAW
        rounds.clear()
        newRound()
        SocketService.sendToAllInGame(id, GameStateChanged(State.DRAW.name))
    }

    fun newRound(){
        rounds.add(Round(rounds.size+1, SentenceGenerator.generate()))
    }

    enum class State {
        WAITING_TO_START,
        EXPLAIN,
        DRAW
    }
}
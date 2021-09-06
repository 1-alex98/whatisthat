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
    var impostorActionsLeft: ImpostorActions? = null

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
        playerList.random().role = "impostor"
    }

    fun resetForStart() {
        resetReady()
        _playerList.removeIf { !it.connected }
    }

    suspend fun reset() {
        resetReady()
        rounds.clear()
        settings = null
        _playerList.removeIf{ !it.connected }
        val resetPlayers = _playerList.map { Player(it.name, it.id, it.host, it.connected) }
        _playerList.clear()
        _playerList.addAll(resetPlayers)
        state = State.WAITING_TO_START
        SocketService.sendToAllInGame(id, GameStateChanged(State.WAITING_TO_START.name))
    }

    fun allReady(): Boolean {
        return playerList.find { !it.ready } == null
    }

    suspend fun startFirstRound() {
        newRound()
    }

    suspend fun newRound(){
        state = State.DRAW
        rounds.add(Round(rounds.size+1, SentenceGenerator.generate()))
        resetReady()
        SocketService.sendToAllInGame(id, GameStateChanged(State.DRAW.name))
    }

    private fun resetReady() {
        playerList.forEach { it.ready = false }
    }

    fun playerIds (): Set<String> {
        return playerList.map { it.id }.toSet()
    }

    fun getNameFromId(key: String): String {
        return playerList.find { it.id == key }!!.name
    }

    suspend fun nextRoundOrVote() {
        if (rounds.size == settings!!.rounds){
            vote()
        } else {
            newRound()
        }
    }

    private suspend fun vote() {
        state = State.VOTE
        resetReady()
        SocketService.sendToAllInGame(id, GameStateChanged(State.VOTE.name))
    }

    fun start(settings: GameSettings) {
        this.settings = settings
        impostorActionsLeft = settings.impostorActions.copy()
        state = State.EXPLAIN
        resetForStart()
        assignRoles()
    }

    fun penultimateRound(): Round? {
        if (rounds.size <= 1) {
            return null
        }
        return rounds[rounds.size - 2]
    }

    enum class State {
        WAITING_TO_START,
        EXPLAIN,
        DRAW,
        REVIEW,
        VOTE,
        RESULT,
    }
}
package com.example.engine.game

import com.example.engine.sentencegeneration.Sentence

class Round (val number: Int, val sentence: Sentence) {
    var hackedPlayerIdNextRound: String? = null
    private val _images: MutableMap<String, String> = mutableMapOf()
    val images:Map<String, String>
        get() = _images
    var impostorKnowsFullSentence = false

    fun addImage(existingPlayerId: String, receive: String) {
        _images[existingPlayerId] = receive
    }

    fun getMissingPlayers(players: Set<String>): Set<String> {
        return players.subtract(_images.keys)
    }
}
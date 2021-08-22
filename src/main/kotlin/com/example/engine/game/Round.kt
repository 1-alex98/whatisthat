package com.example.engine.game

import com.example.engine.sentencegeneration.Sentence
import com.example.engine.sentencegeneration.Template

class Round (val number: Int, val sentence: Sentence) {
    private val images: MutableMap<String, String> = mutableMapOf()
    fun addImage(existingPlayerId: String, receive: String) {
        images[existingPlayerId] = receive
    }

    fun getMissingPlayers(players: Set<String>): Set<String> {
        return players.subtract(images.keys)
    }

}
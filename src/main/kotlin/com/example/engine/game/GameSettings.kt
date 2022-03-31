package com.example.engine.game

import com.example.routes.lobby.SettingsRequest

class GameSettings(
    val rounds: Int, val secondsDrawing: Int,
    val secondsDiscussing: Int, impostorHacking: Int,
    impostorGetsCompleteSentence: Int
){
    val impostorActions: ImpostorActions = ImpostorActions(impostorHacking, impostorGetsCompleteSentence)

    constructor(startRequest: SettingsRequest) : this(
        startRequest.rounds,
        startRequest.drawTime,
        startRequest.reviewTime,
        startRequest.impostorHacking,
        startRequest.impostorGetsCompleteSentence
    )
}

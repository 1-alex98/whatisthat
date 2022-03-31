package com.example.routes.lobby

import com.example.engine.game.GameSettings
import com.example.engine.game.ImpostorActions
import kotlinx.serialization.Serializable

@Serializable
class GameSettingsAnswer(
    val rounds: Int, val secondsDrawing: Int,
    val secondsDiscussing: Int, val impostorHacking: Int,
    val impostorGetsCompleteSentence: Int
){

    constructor(settings: GameSettings) : this(
        settings.rounds,
        settings.secondsDrawing,
        settings.secondsDiscussing,
        settings.impostorActions.impostorHacking,
        settings.impostorActions.impostorGetsCompleteSentence,
    )
}

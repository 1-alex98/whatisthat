package com.example.engine.game

import com.example.routes.lobby.StartRequest

class GameSettings(
    val rounds: Int, val secondsDrawing: Int,
    val secondsDiscussing: Int, impostorHacking: Int,
    impostorGetsCompleteSentence: Int
){
    val impostorActions: ImpostorActions= ImpostorActions(impostorHacking, impostorGetsCompleteSentence);
    constructor(startRequest: StartRequest) : this(startRequest.rounds, startRequest.drawTime, startRequest.reviewTime, startRequest.impostorHacking, startRequest.impostorGetsCompleteSentence)
}

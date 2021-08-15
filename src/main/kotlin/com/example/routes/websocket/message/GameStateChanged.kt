package com.example.routes.websocket.message

import kotlinx.serialization.Serializable

@Serializable
class GameStateChanged(val state: String) : Message(2, state)
package com.example.routes.websocket.message

import kotlinx.serialization.Serializable

@Serializable
class PlayersChanged : Message(1, "Player joined the lobby")
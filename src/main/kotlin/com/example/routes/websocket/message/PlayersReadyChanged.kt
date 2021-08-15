package com.example.routes.websocket.message

import kotlinx.serialization.Serializable

@Serializable
class PlayersReadyChanged : Message(3, "Player ready state changed")
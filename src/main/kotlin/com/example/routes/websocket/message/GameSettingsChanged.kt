package com.example.routes.websocket.message

import kotlinx.serialization.Serializable

@Serializable
class GameSettingsChanged() : Message(4, "new settings")
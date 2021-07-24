package com.example.routes.lobby

import kotlinx.serialization.Serializable

@Serializable
data class JoinRequest(val gameId: String, val playerName: String)

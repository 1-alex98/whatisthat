package com.example.routes.lobby

import kotlinx.serialization.Serializable

@Serializable
data class StartRequest(val rounds: Int)
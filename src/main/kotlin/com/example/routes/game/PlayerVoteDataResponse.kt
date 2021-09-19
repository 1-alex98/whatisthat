package com.example.routes.game

import kotlinx.serialization.Serializable

@Serializable
data class PlayerVoteDataResponse(val name: String, val votes: Int)

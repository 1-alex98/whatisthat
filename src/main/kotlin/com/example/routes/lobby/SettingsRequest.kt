package com.example.routes.lobby

import kotlinx.serialization.Serializable

@Serializable
data class SettingsRequest(val rounds: Int, val drawTime: Int,
                           val reviewTime:Int, val impostorHacking:Int,
                           val impostorGetsCompleteSentence: Int)

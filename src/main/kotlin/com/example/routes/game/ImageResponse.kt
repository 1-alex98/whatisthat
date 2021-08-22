package com.example.routes.game

import kotlinx.serialization.Serializable

@Serializable
data class ImageResponse(val name: String, val dataUrl: String)

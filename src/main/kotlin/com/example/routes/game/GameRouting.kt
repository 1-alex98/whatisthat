package com.example.routes.game

import io.ktor.routing.*

fun Routing.game() {
    route("api/game") {
        explain()
    }
}


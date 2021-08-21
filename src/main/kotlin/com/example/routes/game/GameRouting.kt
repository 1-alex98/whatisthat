package com.example.routes.game

import com.example.engine.store.getExistingGame
import com.example.engine.store.isAlien
import com.example.routes.CustomStatusCodeException
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*

fun Routing.game() {
    route("api/game") {
        explain()

        get("sentence-crew"){
            if(call.isAlien()) {
                throw CustomStatusCodeException(403)
            }
            val existingGame = call.getExistingGame()
            val last = existingGame.rounds.last()
            call.respond(last.sentence.asStringComplete())
        }

        get("sentence-alien"){
            val existingGame = call.getExistingGame()
            val last = existingGame.rounds.last()
            call.respond(last.sentence.asStringHidden())
        }
    }
}


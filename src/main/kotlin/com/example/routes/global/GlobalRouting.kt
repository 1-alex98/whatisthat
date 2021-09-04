package com.example.routes.global

import com.example.engine.store.getExistingGame
import com.example.engine.store.getGame
import com.example.engine.store.isImpostor
import com.example.routes.CustomStatusCodeException
import com.example.session.GameSession
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.sessions.*

fun Routing.global() {
    route("api/global") {
        get("game-state") {
            val game = call.getGame()
            if(game == null){
                call.respond("")
                return@get
            }
            call.respond(game.state.name)
        }

        post ("quit") {
            call.sessions.clear<GameSession>()
            call.respond(HttpStatusCode.OK)
        }

        post ("reset") {
            call.getExistingGame().reset()
            call.respond(HttpStatusCode.OK)
        }

        get("impostor-actions-left"){
            if(!call.isImpostor()){
                throw CustomStatusCodeException(403, "Impostor only action")
            }
            val existingGame = call.getExistingGame()
            val impostorActions = existingGame.impostorActionsLeft!!
            call.respond(ImpostorActionsLeft(impostorActions.impostorHacking, impostorActions.impostorGetsCompleteSentence))
        }
    }
}

package com.example.plugins

import com.example.session.GameSession
import io.ktor.sessions.*
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*

fun Application.configureSession() {
    install(Sessions) {
        cookie<GameSession>("MY_SESSION") {
            cookie.extensions["SameSite"] = "lax"
        }
    }


    //routing {
    //    get("/session/increment") {
    //        val session = call.sessions.get<MySession>() ?: MySession()
    //        call.sessions.set(session.copy(count = session.count + 1))
    //        call.respondText("Counter is ${session.count}. Refresh to increment.")
    //    }
    //}
}

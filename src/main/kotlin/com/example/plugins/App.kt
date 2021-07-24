package com.example.plugins

import io.ktor.routing.*
import io.ktor.http.*
import io.ktor.content.*
import io.ktor.http.content.*
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.request.*

fun Application.servingApp() {


    routing {
        // One day will serve the react app
        static("/") {
            resources("static")
        }
    }
}

package com.example.plugins

import com.example.routes.CustomStatusCodeException
import io.ktor.routing.*
import io.ktor.http.*
import io.ktor.content.*
import io.ktor.http.content.*
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.response.*
import io.ktor.request.*

fun Application.statusPage() {
    install(StatusPages) {
        exception<CustomStatusCodeException> { cause ->
            call.respond(HttpStatusCode(cause.statusCode.toInt(), cause.responseMessage))
        }
    }
}
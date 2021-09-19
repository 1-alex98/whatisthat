package com.example.plugins

import com.example.routes.CustomStatusCodeException
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.response.*

fun Application.statusPage() {
    install(StatusPages) {
        exception<CustomStatusCodeException> { cause ->
            call.respond(cause.statusCode, cause.responseMessage)
        }
    }
}
package com.example.plugins

import io.ktor.routing.*
import io.ktor.http.*
import io.ktor.content.*
import io.ktor.http.content.*
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.response.*
import io.ktor.request.*

fun Application.cors() {
    install(CORS){
        method(HttpMethod.Options)
        method(HttpMethod.Patch)
        method(HttpMethod.Put)
        allowNonSimpleContentTypes = true

        header(HttpHeaders.ContentType)
        host("localhost:3000")
    }
}

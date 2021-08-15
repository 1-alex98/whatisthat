package com.example

import com.example.engine.sentencegeneration.SentenceGenerator
import com.example.engine.sentencegeneration.TemplateStore
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import com.example.plugins.*
import com.example.routes.CustomStatusCodeException
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.response.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        configureSerialization()
        configureWebsockets()
        configureSession()
        routing()
        servingApp()
        statusPage()
        initSentenceParsing()
    }.start(wait = true)
}

private fun initSentenceParsing() {
    SentenceGenerator.load()
}



package com.example

import com.example.engine.sentencegeneration.SentenceGenerator
import com.example.plugins.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        configureSerialization()
        configureWebsockets()
        configureSession()
        routing()
        statusPage()
        initSentenceParsing()
    }.start(wait = true)
}

private fun initSentenceParsing() {
    SentenceGenerator.load()
}



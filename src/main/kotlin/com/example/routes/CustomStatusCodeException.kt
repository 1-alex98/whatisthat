package com.example.routes

import io.ktor.http.*

class CustomStatusCodeException(val statusCode: HttpStatusCode, val responseMessage: String) : Throwable()

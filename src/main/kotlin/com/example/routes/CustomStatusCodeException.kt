package com.example.routes

class CustomStatusCodeException(val statusCode: Number, val responseMessage: String) : Throwable() {

}

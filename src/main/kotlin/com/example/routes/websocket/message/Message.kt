package com.example.routes.websocket.message

import kotlinx.serialization.Serializable

@Serializable
open class Message{
    var identifier: Int? = null
    var message: String? = null

    constructor(identifier: Int, message:String){
        this.identifier = identifier
        this.message = message
    }
}
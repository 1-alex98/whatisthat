package com.example.routes.websocket

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.example.routes.websocket.message.Message
import com.example.session.GameSession
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.cio.websocket.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.sessions.*
import io.ktor.websocket.*
import kotlinx.coroutines.channels.Channel
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.security.SecureRandom
import java.util.*
import kotlin.collections.LinkedHashMap
import kotlin.random.asKotlinRandom

val gameChannels: MutableMap<String, MutableMap<String, Channel<Message>>> = LinkedHashMap()

object SocketService{
    suspend fun sendToAllInGame(gameId: String, message: Message){
        val allChannels = gameChannels[gameId]
        allChannels ?: return
        for (channel in allChannels){
            channel.value.send(message)
        }
    }
}
val nextBytes = SecureRandom.getInstanceStrong().asKotlinRandom().nextBytes(300)

fun Routing.websocket() {

    webSocket("/ws/listen") {
        var channel: Channel<Message>? = null
        val (playerId, gameId) = getPlayerAndGameId()
        try {
            channel = addChannel(gameChannels, playerId, gameId)
            while (true){
                val command = channel.receive()
                outgoing.send(Frame.Text(Json.encodeToString(command)))
            }
        } catch (e: Throwable) {
            if (channel != null){
                if(!channel.isClosedForSend){
                    outgoing.send(Frame.Text(e.message?:"unknown error"))
                }
                removeChannel(channel, playerId, gameId)
            }
            throw e
        }
    }

    get("/api/token"){
        val session = call.sessions.get<GameSession>()
        session?: throw BadRequestException("You need to be in a session")
        val token = JWT.create()
            .withAudience("WebsocketRouting")
            .withIssuer("WebsocketRouting")
            .withClaim("gameId", session.gameId)
            .withClaim("playerId", session.playerId)
            .withExpiresAt(Date(System.currentTimeMillis() + 30_000))
            .sign(Algorithm.HMAC256(nextBytes))
        call.respond(token)
    }
}

private fun removeChannel(channel: Channel<Message>, playerId: String, gameId: String) {
    val mutableMap = gameChannels[gameId]
    mutableMap?.remove(playerId)
    channel.close()
}

private suspend fun DefaultWebSocketServerSession.getPlayerAndGameId() :  Pair<String, String> {
    try{
        val receive = incoming.receive()
        receive as Frame.Text
        val readText = receive.readText()
        val build = JWT
            .require(Algorithm.HMAC256(nextBytes))
            .withAudience("WebsocketRouting")
            .withIssuer("WebsocketRouting")
            .build()
        val verify = build.verify(readText)
        return Pair(verify.getClaim("playerId").asString(), verify.getClaim("gameId").asString())
    }catch (e: Throwable){
        outgoing.send(Frame.Text(e.message?:e.javaClass.canonicalName))
        throw e
    }
}

fun addChannel(
    gameChannels: MutableMap<String, MutableMap<String, Channel<Message>>>,
    playerId: String,
    gameId: String,
): Channel<Message> {
    val listOfChannels: MutableMap<String, Channel<Message>> = gameChannels.get(gameId) ?: {
        val value:MutableMap<String, Channel<Message>> = LinkedHashMap()
        gameChannels.put(gameId, value)
        value
    }()
    val channel: Channel<Message> = Channel()
    listOfChannels[playerId] = channel
    return channel
}

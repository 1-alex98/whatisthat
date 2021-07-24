package com.example.routes.websocket

import com.example.engine.store.getGame
import com.example.routes.websocket.message.Message
import com.example.session.getPlayerId
import io.ktor.features.*
import io.ktor.http.cio.websocket.*
import io.ktor.routing.*
import io.ktor.sessions.*
import io.ktor.websocket.*
import kotlinx.coroutines.channels.Channel
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.rmi.UnexpectedException
import kotlin.collections.LinkedHashMap

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

fun Routing.websocket() {
    route("api/listen") {
        webSocket("") {
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
    }

}

private fun DefaultWebSocketServerSession.removeChannel(channel: Channel<Message>, playerId: String, gameId: String) {
    val mutableMap = gameChannels[gameId]
    mutableMap?.remove(playerId)
    channel.close()
}

private suspend fun DefaultWebSocketServerSession.getPlayerAndGameId() :  Pair<String, String> {
    try{
        val game = call.getGame()
        game ?: throw BadRequestException("You can only listen if you joined a game")
        val gameId = game.id
        val playerId = call.getPlayerId()
        playerId ?: throw BadRequestException("You can only listen if you joined a game")
        return Pair(playerId, gameId)
    }catch (e: Throwable){
        outgoing.send(Frame.Text(e.message?:e.javaClass.canonicalName))
        throw e
    }
}

fun DefaultWebSocketServerSession.addChannel(
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

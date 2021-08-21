package com.example.engine.sentencegeneration

import kotlinx.serialization.Serializable

class Sentence (val template:Template){
    private val selectedOptions: Map<Block, String>
    private val hiddenBlock: Block = template.usedBlocks.random()

    init {
        selectedOptions = choseOptions()
    }

    private fun choseOptions(): Map<Block, String> {
        val selectedMap = mutableMapOf<Block, String>()
        template.usedBlocks.forEach { selectedMap[it] = it.options.random() }
        return selectedMap
    }

    fun asStringComplete(): String {
        var sentenceString = template.raw
        selectedOptions.forEach {
            sentenceString = sentenceString.replace(
                "{${it.key.id}}", it.value
            )
        }
        return sentenceString
    }

    fun asStringHidden(): SentenceWithOptions {
        var sentenceString = template.raw
        selectedOptions.forEach {
            val replacement =  if (it.key == hiddenBlock) "{${it.key.name}}" else it.value
            sentenceString = sentenceString.replace(
                "{${it.key.id}}", replacement
            )
        }
        return SentenceWithOptions(sentenceString, hiddenBlock.name, hiddenBlock.options)
    }
}

@Serializable
data class SentenceWithOptions(val raw: String, val optionsName: String, val options: Set<String>) {
}

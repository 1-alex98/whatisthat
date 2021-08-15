package com.example.engine.sentencegeneration

class Template (val raw: String){
    val usedBlocks: MutableList<Block> = mutableListOf()
}
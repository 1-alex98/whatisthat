package com.example.engine.sentencegeneration

class Template(val raw: String, allBlocks: Set<Block>) {
    var usedBlocks: List<Block>;

    init {
        this.usedBlocks = parseBlocks(allBlocks)
    }

    private fun parseBlocks(allBlocks: Set<Block>): List<Block> {
        val findAll = Regex("\\{([^{]+)}").findAll(raw)
        return findAll.map { matchResult ->
            val identifier = matchResult.groupValues[1]
            allBlocks.find { it.id == identifier }
        }.map { it!! }.toList()
    }
}
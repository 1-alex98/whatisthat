package com.example.engine.sentencegeneration

import com.amihaiemil.eoyaml.Yaml
import com.example.engine.game.Game
import java.io.File
import java.net.URL
import java.nio.file.Path
import kotlin.io.path.Path
import kotlin.io.path.listDirectoryEntries


object TemplateStore {
    private val sentences: Set<Template>
    private val blocks: Set<Block>

    init {
        blocks = parseBlocks()
        sentences = parseSentences()
    }

    private fun parseBlocks(): Set<Block> {
        val blocks = mutableSetOf<Block>()
        val resource: URL = Game::class.java.classLoader.getResource("sentences/block")!!
        Path(resource.path)
            .listDirectoryEntries()
            .forEach {
                blocks.add(parseBlock(it))
            }
        return blocks
    }

    private fun parseBlock(path: Path): Block {
        val yaml = Yaml.createYamlInput(path.toFile()).readYamlMapping()
        val id = yaml.string("id")
        val name = yaml.string("name")
        val options = yaml.yamlSequence("options")
        return Block(id, name, options.map { it.asScalar().value() }.toSet())
    }

    private fun parseSentences(): Set<Template> {
        val templates = mutableSetOf<Template>()
        val resource: URL = Game::class.java.classLoader.getResource("sentences/sentences.yml")!!
        val createYamlInput = Yaml.createYamlInput(File(resource.toURI()))
        val readYamlMapping = createYamlInput.readYamlMapping()
        val yamlSequence = readYamlMapping.yamlSequence("sentences")
        yamlSequence.map {
            val raw = it.asScalar().value()
            templates.add(parseSentence(raw))
        }
        return templates
    }

    private fun parseSentence(raw: String): Template {
        TODO("Not yet implemented")
    }

}
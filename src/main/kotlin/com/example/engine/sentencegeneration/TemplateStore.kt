package com.example.engine.sentencegeneration

import com.amihaiemil.eoyaml.Yaml
import com.example.engine.game.Game
import java.io.File
import java.net.URL
import java.nio.file.Path
import kotlin.io.path.Path
import kotlin.io.path.listDirectoryEntries


object TemplateStore {
    private val templates: Set<Template>
    private val blocks: Set<Block>

    init {
        blocks = parseBlocks()
        templates = parseTemplates()
    }

    private fun parseBlocks(): Set<Block> {
        val blocks = mutableSetOf<Block>()
        val resource: URL = loadFile("/sentences/block")
        Path(resource.path)
            .listDirectoryEntries()
            .forEach {
                blocks.add(parseBlock(it))
            }
        return blocks
    }

    private fun loadFile(path: String): URL {
        if(System.getenv("SENTENCES_PATH") != null){
            return URL("file:"+System.getenv("SENTENCES_PATH")!!+path)
        }
        return Game::class.java.getResource(path)!!
    }

    private fun parseBlock(path: Path): Block {
        val yaml = Yaml.createYamlInput(path.toFile()).readYamlMapping()
        val id = yaml.string("id")
        val name = yaml.string("name")
        val options = yaml.yamlSequence("options")
        return Block(id, name, options.map { it.asScalar().value() }.toSet())
    }

    private fun parseTemplates(): Set<Template> {
        val templates = mutableSetOf<Template>()
        val resource: URL = loadFile("/sentences/sentences.yml")
        val createYamlInput = Yaml.createYamlInput(File(resource.toURI()))
        val readYamlMapping = createYamlInput.readYamlMapping()
        val yamlSequence = readYamlMapping.yamlSequence("sentences")
        yamlSequence.map {
            val raw = it.asScalar().value()
            templates.add(Template(raw, blocks))
        }
        return templates
    }

    fun randomTemplate(): Template {
        return templates.random()
    }


}
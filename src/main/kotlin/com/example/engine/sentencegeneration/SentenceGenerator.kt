package com.example.engine.sentencegeneration

import com.amihaiemil.eoyaml.Yaml
import java.io.File

object SentenceGenerator {
    val store: TemplateStore = TemplateStore

    fun generate() : Sentence{
        val randomTemplate = store.randomTemplate()
        return Sentence(randomTemplate)
    }

    fun load() {
        // just a method to illustrate what is happening here
    }
}
'use strict'
import path from 'node:path'
import { readFile, readdir } from 'node:fs/promises'
import showdown from 'showdown'
import { RequiredFiles } from './fileIO.js'
import { Document } from '../../classes/document.js'
import { entityCharToNormalChar } from '../../../../legacy/src/string.js'

class DocumentLoader {
  static defaults = {
    showdown: {
      options: {
        noHeaderId: true,
        ghCompatibleHeaderId: true,
        metadata: true
      }
    }
  }

  static getDocList = async () => {
    if (!RequiredFiles.requiredExists.docs)
      throw new Error(`Document directory (${RequiredFiles.requiredPaths.docs}) is not exists.`)
  
    return await readdir(path.join(path.resolve(), RequiredFiles.requiredPaths.docs))
  }
  
  static loadDocumentInstance = async (filename, options = {}) => {
    if (!RequiredFiles.requiredExists.docs)
      throw new Error(`Document directory (${RequiredFiles.requiredPaths.docs}) is not exists.`)

    // Load `options`
    let _options = {}
    for (const each of Object.keys(DocumentLoader.defaults.showdown.options)) {
      _options[each] = DocumentLoader.defaults.showdown.options[each]
    }
    for (const each of Object.keys(options)) {
      _options[each] = options[each]
    }

    // Load file
    const filepath = path.join(path.resolve(), RequiredFiles.requiredPaths.docs, filename)
    const fileContent = await readFile(filepath, { encoding: 'utf8' })

    // Convert
    const converter = new showdown.Converter(_options)
    const content = converter.makeHtml(fileContent)
    const context = DocumentLoader._parseObjectChild(converter.getMetadata())
    return new Document(context, content)
  }

  static _parseObjectChild = (obj) => {
    for (const each of Object.keys(obj)) {
      if (obj[each].charAt(0) === '[') {
        obj[each] = DocumentLoader._parseList(obj[each])
      }
    }
    return obj
  }
  static _parseList = (text) => {
    return JSON.parse(entityCharToNormalChar(text))
  }
}

export { DocumentLoader }

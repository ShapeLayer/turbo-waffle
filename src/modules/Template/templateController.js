'use strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import nunjucks from 'nunjucks'
import { RequiredFiles } from '../FileIO/fileIO.js'
import { Template } from '../../classes/template.js'

class Templates {
  static templates = {}

  constructor (config) {}

  init = async () => {
    if (!RequiredFiles.requiredExists.templates)
      throw new Error(`Template definitions directory (${RequiredFiles.requiredPaths.templates}) is not exists.`)

    const files = await readdir(path.join(path.resolve(), RequiredFiles.requiredPaths.templates), { withFileTypes: true })
    for (const file of files) {
      if (!file.isFile())
        continue
      const name = file.name.split('.').slice(0, -1)
      const filePath = path.join(path.resolve(), RequiredFiles.requiredPaths.templates, file.name)
      const content = await readFile(filePath, { encoding: 'utf8' })
      Templates.templates[name] = content
    }
  }

  static load = (template) => {
    if (Templates.templates[template])
      return new Template(template, Templates.templates[template])
    else
      throw new Error(`Template ${template} is not found.`)
  }

  static build = async (template, context) => {
    if (!template instanceof Template)
      throw new Error('`template` is must be instance of `Template` class.')
    return nunjucks.renderString(template.template, context)
  }
}


export { Templates }

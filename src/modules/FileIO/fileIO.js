'use strict'
import path from 'node:path'
import * as fs from 'node:fs/promises'

class RequiredFiles {
  static requiredExists = {
    docs: undefined,
    layouts: undefined,
    templates: undefined,
    processes: undefined
  }
  static requiredPaths = {
    docs: '_docs',
    layouts: '_layouts',
    templates: '_templates',
    processes: '_processes'
  }

  constructor(config) {
    if (config.path) {
      if (config.path.requiredDirs) {
        for (const each in config.path.requiredDirs) {
          RequiredFiles.requiredExists[each] = config.path.requiredDirs[each]
        }
      }
    }
  }

  init = async () => {
    await this._initCheckRequiredDirs()
  }
  _initCheckRequiredDirs = async () => {
    for (const each of Object.keys(RequiredFiles.requiredPaths)) {
      try {
        await fs.access(path.join(path.resolve(), RequiredFiles.requiredPaths[each]))
        RequiredFiles.requiredExists[each] = true
      } catch {
        RequiredFiles.requiredExists[each] = false
      }
    }
  }

  get docsExists() {
    return RequiredFiles.requiredExists.docs === true
  }
  get layoutsExists() {
    return RequiredFiles.requiredExists.layouts === true
  }
  get templatesExists() {
    return RequiredFiles.requiredExists.templates === true
  }
  get processesExists() {
    return RequiredFiles.requiredExists.processes === true
  }
}

export { RequiredFiles }

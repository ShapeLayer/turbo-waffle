'use strict'
import path from 'node:path'
import { readdir, readFile } from 'node:fs/promises'
import { Layout } from '../../classes/layout.js'
import { RequiredFiles } from '../FileIO/fileIO.js'

class Layouts {
  static layouts = {}

  constructor (config) {}

  init = async () => {
    if (!RequiredFiles.requiredExists.layouts)
      throw new Error(`Layout definitions directory (${RequiredFiles.requiredPaths.layouts}) is not exists.`)

    const files = await readdir(path.join(path.resolve(), RequiredFiles.requiredPaths.layouts))
    for (const file of files) {
      const name = file.split('.').slice(0, -1)
      const filePath = path.join(path.resolve(), RequiredFiles.requiredPaths.layouts, file)
      const content = await readFile(filePath, { encoding: 'utf8' })
      const layout = new Layout(
        JSON.parse(content)
      )
      Layouts.layouts[name] = layout
    }
  }

  static load = (layout) => {
    if (Layouts.layouts[layout])
      return Layouts.layouts[layout]
    else
      throw new Error(`Layout ${layout} is not found.`)
  }
}

export { Layouts }

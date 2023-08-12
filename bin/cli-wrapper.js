#!/usr/bin/env node
'use strict'
import { TurboWaffle } from '../src/TurboWaffle.js'
import { writeFile } from 'node:fs/promises'

const [,, ...args] = process.argv
const tw = new TurboWaffle()


let options = {
  outputPath: TurboWaffle.defaults.config.output.writeOutputFilename
}
for (const arg of args) {
  if (arg.startsWith('--output')) {
    const [key, val] = arg.split('=')
    options.outputPath = val
  }
}

await tw.init()
const docs = await tw.loadDocs()
const rendered = await tw.renderDocuments(docs)
const pdfBuf = await tw.mergePdf(await tw.makePagesPdf(rendered))

await writeFile(options.outputPath, pdfBuf)

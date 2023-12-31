'use strict'
import puppeteer from 'puppeteer'
import { PDFDocument } from 'pdf-lib'
import path from 'node:path'

class PDFWrapper {
  constructor () {}
  init = async () => {
    this.browser = await puppeteer.launch({
      headless: 'new'
    })
    this.page = await this.browser.newPage()
  }
  close = async () => {
    this.browser.close()
  }
  
  makePagePdf = async (str) => {
    await this.page.setContent(str, { waitUntil: 'networkidle2' })
    await this.page.waitForNetworkIdle()
    return await this.page.pdf({ format: 'A4' })
  }

  makeFilePdf = async (filepath) => {
    await this.page.goto(
      `file:${path.join(path.resolve(), filepath)}`, { waitUntil: 'networkidle2' }
    )
    await this.page.waitForNetworkIdle()
    return await this.page.pdf({ format: 'A4' })
  }

  static mergePdfBufs = async (pdfBufs) => {
    const merged = await PDFDocument.create()
    for (const each of pdfBufs) {
      const eachLoaded = await PDFDocument.load(each)
      const copiedPages = await merged.copyPages(eachLoaded, eachLoaded.getPageIndices())
      for (const eachPage of copiedPages) {
        merged.addPage(eachPage)
      }
    }
    return await merged.save()
  }
}

export { PDFWrapper }

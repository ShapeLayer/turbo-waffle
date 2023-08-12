'use strict'
import { Document } from './classes/document.js'
import { DocumentLoader } from './modules/FileIO/docfiles.js'
import { RequiredFiles } from './modules/FileIO/fileIO.js'
import { Layouts } from './modules/Layout/layoutController.js'
import { Templates } from './modules/Template/templateController.js'
import { TemplateRenderer } from './modules/Template/templateRenderer.js'
import { PDFWrapper } from './modules/PDFWrapper/pdfWrapper.js'
import { pageBreaker } from './utils/htmlElements.js'

class TurboWaffle {
  static defaults = {
    config: {
      render: {
        baseLayoutName: 'base',
        renderDocument: {
          compression: true
        }
      },
      output: {
        writeOutputFilename: 'output.pdf'
      }
    }
  }
  static config = {}

  constructor (config = {}) {
    for (const each of Object.keys(TurboWaffle.defaults.config)) {
      TurboWaffle.config[each] = TurboWaffle.defaults.config[each]
    }
    for (const each of Object.keys(config)) {
      TurboWaffle.config[each] = config[each]
    }

    this.requiredFiles = new RequiredFiles(config)
    this.layouts = new Layouts(config)
    this.templates = new Templates(config)
  }

  init = async () => {
    await this.requiredFiles.init()
    await this.layouts.init()
    await this.templates.init()
  }

  // Load Docs
  loadDocs = async () => {
    // return: Array<Document>
    return await this._loadDocs()
  }
  loadDoc = async (filename) => {
    return await this._loadDoc(filename)
  }
  _loadDocs = async () => {
    const docList = await DocumentLoader.getDocList()
    let loaded = []
    for (const each of docList) {
      loaded.push(await this.loadDoc(each))
    }
    return loaded
  }
  _loadDoc = async (filename) => {
    return await DocumentLoader.loadDocumentInstance(filename)
  }

  // Render Docs
  renderDocuments = async (documents, options = {}) => {
    // Load options
    let _options = TurboWaffle.defaults.config.render.renderDocument
    for (const option of Object.keys(options)) {
      _options[option] = options[option]
    }
    
    // Render layout
    let layoutRendered = []
    let previousLayout = undefined
    for (const doc of documents) {
      if (!doc instanceof Document)
        throw new Error('`documents` is must be list of `Document` instances.')
      const _layoutRenderedEachDoc = await this._renderDoc__layout(doc)
      

      // Compress compatible layouts
      if (_options.compression && _options.compression === true) {
        if (previousLayout && doc.layout.compatibles.includes(previousLayout)) {
          const peekIdx = layoutRendered.length - 1
          layoutRendered[peekIdx] = layoutRendered[peekIdx].concat(
            /*pageBreaker + */_layoutRenderedEachDoc
          )
        } else {
          layoutRendered.push(_layoutRenderedEachDoc)
        }
      } else {
        layoutRendered.push(_layoutRenderedEachDoc)
      }

      previousLayout = doc.layoutName
    }

    // Render base
    let baseRendered = []
    for (const each of layoutRendered) {
      baseRendered.push(await this._renderDoc__base(each))
    }
    return baseRendered
  }
  renderDocument = async (document, options = {}) => {
    if (!document instanceof Document)
      throw new Error('`document` is must be instance of `Document` class.')
    return await this._renderDoc__base(
      await this._renderDoc__layout(document)
    )
  }
  _renderDoc__layout = async (document) => {
    return TemplateRenderer.render(document)
  }
  _renderDoc__base = async (layoutRendered) => {
    return TemplateRenderer.render(
      new Document({ layout: TurboWaffle.config.render.baseLayoutName }, layoutRendered)
    )
  }

  makePagePdf = async (str) => {
    const wrapper = new PDFWrapper
    await wrapper.init()
    const pdfBuf = await this._makePagesPdf(wrapper, str)
    await wrapper.close()
    return pdfBuf
  }
  makePagesPdf = async (arr) => {
    const wrapper = new PDFWrapper
    await wrapper.init()
    let pdfBufs = []
    for (const each of arr) {
      pdfBufs.push(await this._makePagesPdf(wrapper, each))
    }
    await wrapper.close()
    return pdfBufs
  }
  _makePagesPdf = async (wrapper, str) => {
    return await wrapper.makePagePdf(str)
  }

  mergePdf = async (buf) => {
    if (typeof buf[Symbol.iterator] === 'function')
      return await PDFWrapper.mergePdfBufs(buf)
    else
      return buf
  }
}

// layoutRendered가 제대로 수행되지 않는 문제가 있음
export { TurboWaffle }

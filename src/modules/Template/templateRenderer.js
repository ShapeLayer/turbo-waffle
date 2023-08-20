'use strict'
import nunjucks from 'nunjucks'
import path from 'path'
import { Document } from '../../classes/document.js'

class TemplateRenderer {
  static defaults = {
    config: {
      preRender: {
        staticAssets: {
          replacer: '##_STATIC_REPLACER_##',
          path: '_static'
        }
      }
    }
  }

  static _preRender = (document, options={}) => {
    const staticReplacer = (options.staticAssets && options.staticAssets.replacer) ? options.staticAssets.replacer : TemplateRenderer.defaults.config.preRender.staticAssets.replacer
    const staticPath = (options.staticAssets && options.staticAssets.path) ? options.staticAssets.path : TemplateRenderer.defaults.config.preRender.staticAssets.path
    document.context.content = document.context.content.replace(staticReplacer, path.join(path.resolve(), staticPath))
    return document
  }
  static render = (document, options={}) => {
    const preRenderOptions = options.preRender || TemplateRenderer.defaults.config.preRender
    document = TemplateRenderer._preRender(document, preRenderOptions)

    if (!document instanceof Document)
      throw new Error('`document` must be instance of `Document`.')
    const layoutTemplate = document.layout.template.code
    const context = document.context

    return nunjucks.renderString(layoutTemplate, context)
  }
}

export { TemplateRenderer }
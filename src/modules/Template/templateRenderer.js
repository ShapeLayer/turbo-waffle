'use strict'
import nunjucks from 'nunjucks'
import path from 'path'
import { Document } from '../../classes/document.js'
import { readFileSync } from 'node:fs'

class TemplateRenderer {
  static defaults = {
    config: {
      preRender: {
        staticAssets: {
          path: '_static'
        }
      }
    }
  }

  static _preRender = (document, options={}) => {
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
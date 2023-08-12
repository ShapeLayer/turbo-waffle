'use strict'
import nunjucks from 'nunjucks'
import { Document } from '../../classes/document.js'

class TemplateRenderer {
  static render = (document) => {
    if (!document instanceof Document)
      throw new Error('`document` must be instance of `Document`.')
    const layoutTemplate = document.layout.template.code
    const context = document.context
    return nunjucks.renderString(layoutTemplate, context)
  }
}

export { TemplateRenderer }
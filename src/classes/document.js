'use strict'

import { Layouts } from '../modules/Layout/layoutController.js'

class Document {
  static defaults = {
    title: '',
    layoutName: 'article',
    tags: [],
    body: ''
  }

  constructor (context, content) {
    this.context = context
    this.context.content = content
  }

  get title() { return this.context.title ? this.context.title : Document.defaults.title }
  get layoutName() { return this.context.layout ? this.context.layout : Document.defaults.layout }
  get tags() { return this.context.tags ? this.context.tags : Document.defaults.tags }

  get layout() { return Layouts.load(this.layoutName) }
}

export { Document }

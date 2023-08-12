'use strict'
import { Templates } from '../modules/Template/templateController.js'

class Layout {
  static defaults = {
    overrideFrom: undefined,
    templateName: undefined,
    postprocesses: [],
    compatibles: []
  }
  
  constructor(params) {
    this.overrideFrom = params.override_from ? params.override_from : Layout.defaults.overrideFrom
    this.templateName = params.template ? params.template : Layout.defaults.templateName
    this.postprocesses = params.postprocesses ? params.postprocesses : Layout.defaults.postprocesses
    this.compatibles = params.compatibles ? params.compatibles : Layout.defaults.compatibles
  }

  get template() {
    return Templates.load(this.templateName)
  }
}

export { Layout }

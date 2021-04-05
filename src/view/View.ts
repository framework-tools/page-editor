import type { Node as EditorNode } from '../editor/node'
import { NodeViewDesc } from './ViewDescription'

type viewConfig = {
    rootEl: Node
    rootNode: EditorNode
}

export class View {
    #rootEl: Node
    rootNode: EditorNode
    rootViewDesc: NodeViewDesc

    constructor(config: viewConfig) {
        this.#rootEl = config.rootEl
        this.rootViewDesc = new NodeViewDesc(null, [], config.rootEl, config.rootNode, this)
    }

    get rootEl () {
        return this.#rootEl
    }

    set rootEl (rootEl: Node) {
        this.#rootEl = rootEl
        this.rootViewDesc.el = rootEl
    }
}
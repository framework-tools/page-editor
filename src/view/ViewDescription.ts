import type { Node as EditorNode } from '../editor/node'
import type { View } from '../editor/node'

export class ViewDesc {
    el: Node
    parent: ViewDesc
    children: ViewDesc[]

    constructor(parent: ViewDesc | null, children: ViewDesc[], el: Node){
        this.parent = parent
        this.children = children
        this.el = el

        el.ViewDesc = this
    }
}

export class NodeViewDesc extends ViewDesc {
    node: EditorNode
    view: View

    constructor(parent: ViewDesc | null, children: ViewDesc[], el: Node, node: EditorNode, view: View){
        super(parent, children, el)

        this.node = node
        this.view = view
    }
}
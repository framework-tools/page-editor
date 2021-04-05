import type { Node as EditorNode } from '../editor/node'
import type { View } from '../view/View'

type HTMLNode = Node & { viewDesc: ViewDesc }

export class ViewDesc {
    #el: HTMLNode
    parent: ViewDesc
    children: ViewDesc[]

    constructor(parent: ViewDesc | null, children: ViewDesc[], el: HTMLNode){
        this.parent = parent
        this.children = children
        this.el = el
    }

    get el () {
		return this.#el
	}
	
	set el (value) {
		if(value) value.viewDesc = this
		this.#el = value
        if(value){
            this.updateChildren()
        }
	}

    get size() {
        let size = 0
        for(let i = 0; i < this.children.length; i++){
            size += this.children[i].size
        }
        return size
    }

    updateChildren(){
		this.children = (Array.from(this.el.childNodes) as unknown as HTMLNode[]).filter(node => node.viewDesc).map(n => n.viewDesc)
    }
}

export class NodeViewDesc extends ViewDesc {
    node: EditorNode
    view: View

    constructor(parent: ViewDesc | null, children: ViewDesc[], el: HTMLNode, node: EditorNode, view: View){
        super(parent, children, el)

        this.node = node
        this.view = view
    }

    get size () {
        return this.node.size
    }
}

export class TextViewDesc extends NodeViewDesc {
    constructor(parent: ViewDesc, el: HTMLNode, node: EditorNode, view: View){
        super(parent, null, el, node, view)
    }
}
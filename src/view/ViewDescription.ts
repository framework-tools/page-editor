import type { Node as EditorNode } from '../editor/node'
import type { View } from '../view/View'

export type HTMLNode = Node & { viewDesc: ViewDesc }

export class ViewDesc {
    protected _el: HTMLNode
    parent: ViewDesc
    children: ViewDesc[]

    constructor(parent: ViewDesc | null, children: ViewDesc[], el: Node) {
        this.parent = parent
        this.children = children
        this.el = el as HTMLNode
    }

    posBeforeChild(child: ViewDesc) : number {
        for (let i = 0, pos = this.posAtStart; i < this.children.length; i++) {
            let cur = this.children[i]
            if (cur == child) return pos
            pos += cur.size
        }
    }

    // For block nodes, this represents the space taken up by their
    // start/end tokens.
    get border() { return 0 }

    get posBefore() : number {
        return this.parent.posBeforeChild(this)
    }

    get posAtStart () : number {
        return this.parent ? this.parent.posBeforeChild(this) + this.border : 0
    }

    get posAfter() : number {
        return this.posBefore + this.size
    }

    get posAtEnd() : number {
        return this.posAtStart + this.size - 2 * this.border
    }

    get el(): Node {
        return this._el
    }

    set el(value) {
        this._el = value as unknown as HTMLNode
        if (value) {
            this._el.viewDesc = this
        }
    }

    get size() {
        let size = 0
        for (let i = 0; i < this.children.length; i++) {
            size += this.children[i].size
        }
        return size
    }

    updateChildren() {
        this.children = (Array.from(this.el.childNodes) as unknown as HTMLNode[]).filter(node => node.viewDesc).map(n => n.viewDesc)
    }

    posFromDom(dom: Node, offset: number) {
        let pos = 0

        for (let scan = dom as HTMLNode; scan; scan = scan.parentNode as unknown as HTMLNode) {
            let desc = scan.viewDesc
            if(desc){
                pos += desc.parent.posBeforeChild(desc)
                return pos + offset
            }
        }

        return null
    }

    nearestDesc(el: Node) {
        if (this.el.contains(el)) {
            while (true) {
                if ((el as HTMLNode).viewDesc) return (el as HTMLNode).viewDesc
                el = el.parentNode
            }
        } else {
            return null
        }
    }
}

export class NodeViewDesc extends ViewDesc {
    node: EditorNode
    view: View

    constructor(parent: ViewDesc | null, children: ViewDesc[], el: Node, node: EditorNode, view: View) {
        super(parent, children, el)

        this.node = node
        this.view = view
    }
    
    get border() { return this.node.isLeaf ? 0 : 1 }

    updateChildren(){
        //ensure text elements have their viewDescs set
        let childNodes = Array.from(this._el.childNodes as any) as (HTMLNode & CharacterData)[]
        let comments = childNodes.filter(node => node.nodeType === Node.COMMENT_NODE)
        comments.map(comment => new TextViewDesc(this, comment.nextSibling, this.node.children[comment.data], this.view))

        super.updateChildren()
    }
    
    get size() {
        return this.node.size
    }
}

export class TextViewDesc extends NodeViewDesc {
    constructor(parent: ViewDesc, el: Node, node: EditorNode, view: View) {
        super(parent, null, el, node, view)
    }
}
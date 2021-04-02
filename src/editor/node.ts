import { Fragment } from './fragment'
import type { NodeType, Schema } from './schema'

export type NodeSpec = {
    name: string,
    content?: string,
    groups?: string[]
    props?: { [key: string]: any }
    inline?: boolean
    atom?: boolean
}

export class Node {
    static spec: NodeSpec
    props: any
    children: Fragment
    type: NodeType

    constructor (type: NodeType, props: any, children: Fragment) {
        this.type = type
        this.props = props
        this.children = children
    }

    get nodeSize() {
        return this.isLeaf ? 1 : 2 + this.children.size
    }

    // True when this is a block (non-inline node)
    get isBlock() { return this.type.isBlock }

    // True when this is a textblock node, a block node with inline
    // content.
    get isTextblock() { return this.type.isTextblock }

    // True when this node allows inline content.
    get inlineContent() { return this.type.inlineContent }

    // True when this is an inline node (a text node or a node that can
    // appear among text).
    get isInline() { return this.type.isInline }

    get isText() { return this.type.isText }

    get isLeaf() { return this.type.isLeaf }

    get isAtom() { return this.type.isAtom }

    toJSON(){
        return {
            type: this.type.name,
            props: this.props,
            children: this.children.toJSON()
        }
    }

    static fromJSON<T extends Node>(schema: Schema, json) {
        let children = Fragment.fromJSON(schema, json.children)

        let type = schema.nodes[this.spec.name]
        return new this(type, type.computeProps(json.props), children) as T
    }

}

export class TextNode extends Node {
    text: string

    constructor(type: NodeType, content: string){
        super(type, null, null)

        this.text = content
    }

    withText(text) {
        if (text == this.text) return this
        return new TextNode(this.type, text)
    }

    toJSON(){
        return {
            ...super.toJSON(),
            text: this.text
        }
    }
}
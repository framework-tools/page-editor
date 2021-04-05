import { Node, TextNode } from './node'
import type { Schema } from './schema'

export type FragmentType = Node | Fragment | Node[]

export class Fragment extends Array<Node> {
    size: number
    constructor(...children: Node[]) {
        super(...children)

        this.size = 0
        
        for (let i = 0; i < children.length; i++)
            this.size += children[i].size
    }

    toJSON() {
        return this.length ? this.map(n => n.toJSON()) : null
    }

    static fromArray(array: Node[]) {
        let joined

        for (let i = 0; i < array.length; i++) {
            let node = array[i] as TextNode
            if (i && node.isText) {
                if (!joined) joined = array.slice(0, i)
                joined[joined.length - 1] = node.withText(joined[joined.length - 1].text + node.text)
            } else if (joined) {
                joined.push(node)
            }
        }

        return new Fragment(...(joined || array))
    }

    static createFragment(nodes: FragmentType) {
        if (!nodes) return new Fragment()
        if (nodes instanceof Node) return this.fromArray([nodes])
        if (nodes instanceof Fragment) return nodes
        if (Array.isArray(nodes)) return this.fromArray(nodes)
    }

    static fromJSON(schema: Schema, value) {
        if (!value) return new Fragment()

        if (!Array.isArray(value)) throw new RangeError("Invalid input for Fragment.fromJSON")

        return Fragment.fromArray(value.map(schema.nodeFromJSON))
    }
}
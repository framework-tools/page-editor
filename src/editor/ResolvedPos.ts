
import type { Node as EditorNode } from './node'

type PathObject = {
    node: EditorNode,
    index: number,
    offset: number,
}

export class ResolvedPos {
    pos: number
    path: PathObject[]
    depth: number
    parentIndex: number

    constructor(pos: number, path: PathObject[], parentIndex: number){
        this.pos = pos
        this.path = path
        this.depth = path.length - 1
        this.parentIndex = parentIndex
    }

    get parent () {
        return this.node(this.depth)
    }

    node (depth: number = this.depth) {
        return this.path[depth].node
    }

    get doc () {
        return this.node(0)
    }

    index (depth: number = this.depth) {
        return this.path[depth].index
    }

    static resolve(doc: EditorNode, pos: number){
        let start = 0
        let path: PathObject[] = []

        let parentOffset = pos

        for(let node = doc;;){
            let { index, offset } = node.children.findChildIndex(parentOffset)

            let remaining = parentOffset - offset

            path.push({
                node,
                index,
                offset: start + offset
            })
            
            if(!remaining) break

            node = node.children[index]
            
            if(node.isText) break

            parentOffset = remaining - 1
            start += offset + 1
        }

        return new this(pos, path, parentOffset)
    }
}
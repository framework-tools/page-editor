import type { Node as EditorNode } from '../editor/node'

function generateView(node: EditorNode, parent: Tree) {
    if(node.isText) return new TextTree(node, parent)
    return new NodeTree(node, parent)
}

export class TreeFragment {
    tree: Tree
    index: number
    domNode: Node

    constructor(index: number, domNode: Node, tree: Tree){
        this.index = index
        this.domNode = domNode
        this.tree = tree
    }

    get previousSibling (){
        return this.tree.fragments[index - 1]
    }
    
    get nextSibling (){
        return this.tree.fragments[index + 1]
    }
}

export class Tree {
    fragments: TreeFragment[] = []
    node: EditorNode
    parent: Tree
    children: Tree[]

    constructor(node: EditorNode, parent?: Tree) {
        this.parent = parent
        this.node = node
        this.children = node.children ? node.children.map(node => generateView(node, this)) : null
    }

    posBeforeChild(child: Tree) : number {
        for (let i = 0, pos = this.posAtStart; i < this.children.length; i++) {
            let cur = this.children[i]
            if (cur == child) return pos
            pos += cur.size
        }
    }

    setFragment(node: Node, index = 0){
        let fragment = new TreeFragment(index, node, this)
        this.fragments[index] = fragment
        node.fragment = fragment
        node.tree = this
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

    get size() {
        let size = 0
        for (let i = 0; i < this.children.length; i++) {
            size += this.children[i].size
        }
        return size
    }

    posFromDom(dom: Node, offset: number) {
        let pos = 0

        for (let scan = dom; scan; scan = scan.parentNode) {
            let tree = scan.tree
            if(tree){
                if(tree.parent) pos += tree.parent.posBeforeChild(tree)
                if(!tree.node.isAtom) pos += offset
                //if(offset >= tree.size) return pos
                return pos
            }
        }

        return null
    }
}

export class NodeTree extends Tree {
    get border() { return this.node.isLeaf ? 0 : 1 }

    get size() {
        return this.node.size
    }
}

export class DocTraversableView extends NodeTree {
    constructor(node: EditorNode) {
        super(node)
    }
}

export class TextTree extends NodeTree {

}


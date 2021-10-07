import { ResolvedPos } from '../editor/ResolvedPos'
import { Selection } from '../editor/Selection'
import type { Tree } from './Tree'

let currentTree

export function selectionFromDOM (dom: Node, rootTree: Tree) {
    let selection = window.getSelection()
    if(!dom.contains(selection.anchorNode)) return null
    if(!selection.focusNode) return null

    let $anchorFragment = nearestFragmentParent(selection.anchorNode)
    let $headFragment = nearestFragmentParent(selection.focusNode)

    function parents(tree: Tree) {
        var parents = [tree]
        for (; tree; tree = tree.parent) {
            parents.unshift(tree)
        }
        return parents
    }
    
    function getCommonAncestorIndex(parents1: Tree[], parents2: Tree[]) {
    
        if (parents1[0] != parents2[0]) throw new Error('No common ancestor!')
    
        for (var i = 0; i < parents1.length; i++) {
            if (parents1[i] != parents2[i]) return i
        }
    }
    
    function click(){
        let thisTree = $anchorFragment.tree
        var currentTreeParents = parents(currentTree)
        var currentThisParents = parents(thisTree)

        let commonAncestorIndex = getCommonAncestorIndex(currentTreeParents, currentThisParents)
    
        // if(
        //     thisTree.parent === currentTree
        //     || thisTree === currentTree
        //     || commonAncestorTree === thisTree.parent
        //     || commonAncestorTree === thisTree
        // ){
        //     currentTree = thisTree
        // }
        currentTree = currentThisParents[commonAncestorIndex]
    }
    if(!currentTree) currentTree = rootTree
    click()
    console.log(currentTree.fragments[0].domNode)

    let anchorPos = rootTree.posFromDom(selection.anchorNode, selection.anchorOffset)
    let headPos = rootTree.posFromDom(selection.focusNode, selection.focusOffset)

    let $anchor = ResolvedPos.resolve(rootTree.node, anchorPos)
    let $head = ResolvedPos.resolve(rootTree.node, headPos)


    return new Selection($anchor, $head)
}

function nearestFragmentParent(node: Node) {
    for (let scan = node; scan; scan = scan.parentNode) if(scan.fragment) return scan.fragment
}
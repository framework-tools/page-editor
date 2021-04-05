import type { View } from "./View";

export function selectionFromDOM (view: View) {
    let selection = window.getSelection()
    let root = view.rootEl

    if(!root.contains(selection.anchorNode)) return null
    if(!selection.focusNode) return null

    let nearestDesc = view.rootViewDesc.nearestDesc(selection.focusNode)
    
    let anchorPos = view.rootViewDesc.posFromDom(selection.anchorNode, selection.anchorOffset)
    let headPos = view.rootViewDesc.posFromDom(selection.focusNode, selection.focusOffset)

    let $selection = {
        anchorPos,
        $anchor: (selection.anchorNode as any).viewDesc.node,
        headPos,
        $head: (selection.anchorNode as any).viewDesc.node,
    }

    $selection.$anchor.text = 'lalalala'

    return $selection
}

class Selection {
    constructor(){

    }
}

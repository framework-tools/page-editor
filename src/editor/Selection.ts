import type { Tree } from "../view/Tree";
import type { ResolvedPos } from "./ResolvedPos";

export class Selection {
    $anchor: ResolvedPos
    $head: ResolvedPos
    $anchorTree: Tree
    $headTree: Tree

    constructor($anchor: ResolvedPos, $head: ResolvedPos, $anchorTree?: Tree, $headTree?: Tree){
        this.$anchor = $anchor
        this.$head = $head

        this.$anchorTree = $anchorTree
        this.$headTree = $headTree
    }
}
import type { Tree, TreeFragment } from './view/Tree';

declare global {
    interface Node {
        tree: Tree
        fragment: TreeFragment
    }
}
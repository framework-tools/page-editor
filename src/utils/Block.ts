import PageBuilderNode from './PageBuilderNode'
import SvelteDynamicElement from '../Element.svelte'

export default class Block extends PageBuilderNode {
    static spec = {
        name: 'Block',
        content: 'block*',
        groups: ['block'],
        props: {
            ...PageBuilderNode.defaultProps
        }
    }

    get component() {
        return SvelteDynamicElement
    }
}
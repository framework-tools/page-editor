import PageBuilderNode from './PageBuilderNode'

export default class Block extends PageBuilderNode {
    static spec = {
        name: 'Block',
        content: 'block*',
        groups: ['block'],
        props: {
            ...PageBuilderNode.defaultProps
        }
    }
}
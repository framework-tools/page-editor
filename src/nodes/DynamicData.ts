import DynamicBlock from '../nodes/DynamicBlock'
import SvelteDynamicData from '../blocks/DynamicData.svelte'

export default class DynamicData extends DynamicBlock {
    static spec = {
        ...DynamicBlock.spec,
        name: 'DynamicData',
        props: {
            ...DynamicBlock.spec.props,
            key: undefined,
            context: undefined
        }
    }

    get component () {
        return SvelteDynamicData
    }
}
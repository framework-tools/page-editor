import DynamicBlock from '../nodes/DynamicBlock'
import SvelteRepeater from '../blocks/SvelteRepeater.svelte'

export default class Repeater extends DynamicBlock {
    static spec = {
        ...DynamicBlock.spec,
        name: 'Repeater'
    }

    get component () {
        return SvelteRepeater
    }
}
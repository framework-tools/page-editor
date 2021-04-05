<script>
import { setContext } from 'svelte'
import ContentArray from '../ContentArray.svelte'
import { element } from '../store'
import { NodeViewDesc } from '../view/ViewDescription'

export let item
export let node
export let parentViewDesc

let currentNode
element.subscribe(updatedItem => currentNode = updatedItem)
$: tag = node.tag
$: classes = node.classes.join(' ') ?? undefined
$: empty = node.children.length === 0
$: selected = node === currentNode
$: if(parentViewDesc) nodeView = nodeView

let nodeView = new NodeViewDesc(parentViewDesc, [], null, node, parentViewDesc.view)

setContext('item', item)

</script>
<svelte:element
    {tag}
    class={classes}
    class:empty
    class:builder-selected={selected}
    bind:this={nodeView.el}
    >
    <ContentArray
        bind:parentViewDesc={nodeView}/>
</svelte:element>
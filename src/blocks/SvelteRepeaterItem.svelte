<script>
import { setContext } from 'svelte'
import ContentArray from '../ContentArray.svelte'
import { element } from '../store'

export let item
export let tree
export let index

let el
let currentNode
element.subscribe(updatedItem => currentNode = updatedItem)

$: node = tree.node
$: tag = node.tag
$: classes = node.classes.join(' ') ?? undefined
$: empty = node.children.length === 0
$: selected = node === currentNode
$: if(el) tree.setFragment(el, index)

setContext('item', item)

</script>
<svelte:element
    {tag}
    class={classes}
    class:empty
    class:builder-selected={selected}
    bind:this={el}
    >
    <ContentArray
        bind:parentTree={tree}/>
</svelte:element>
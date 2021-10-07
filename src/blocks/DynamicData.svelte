<script>
import { getContext } from 'svelte';
import { element } from '../store'

export let tree

$: node = tree.node
$: item = getContext(node.props.context);
$: classes = node.classes.join(' ') ?? undefined
$: selected = node === currentNode
$: data = item[node.props.key]

let el
$: if(el) tree.setFragment(el)

let currentNode
element.subscribe(updatedItem => currentNode = updatedItem)

</script>
<span
	class={classes}
	class:builder-selected={selected}
	bind:this={el}>
	{ data }
</span>
<style>
	:global(.empty) {
		width: 60px;
		height: 60px;
		border: 1px dashed rgba(0,0,0,0.2);
	}

	:global(.builder-selected) {
		outline: 3px solid rgba(0,100,200,0.4);
	}
</style>
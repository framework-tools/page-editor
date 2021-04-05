<script>
import { getContext } from 'svelte';
import { NodeViewDesc } from '../view/ViewDescription'
import { element } from '../store'

export let node
export let parentViewDesc

const item = getContext(node.props.context);
let currentNode

console.log(item[node.props.key])

element.subscribe(updatedItem => currentNode = updatedItem)

$: classes = node.classes.join(' ') ?? undefined
$: selected = node === currentNode
$: if(parentViewDesc) nodeView = nodeView

let nodeView = new NodeViewDesc(parentViewDesc, [], null, node, parentViewDesc.view)

$: data = item[node.props.key]

</script>
<span
	class={classes}
	class:builder-selected={selected}
	bind:this={nodeView.el}
	>
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
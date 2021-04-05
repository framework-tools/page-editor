<script>
import ContentArray from './ContentArray.svelte'
import { tick } from 'svelte'
import { element } from './store'
import { NodeViewDesc } from './view/ViewDescription'

export let node
export let parentViewDesc

let currentNode
element.subscribe(updatedItem => currentNode = updatedItem)
$: tag = node.tag

function parents(node) {
	var nodes = [node]
	for (; node; node = node.parentNode) {
		nodes.unshift(node)
	}
	return nodes
}

function getCommonAncestor(node1, node2) {
	var parents1 = parents(node1)
	var parents2 = parents(node2)

	if (parents1[0] != parents2[0]) throw new Error('No common ancestor!')

	for (var i = 0; i < parents1.length; i++) {
		if (parents1[i] != parents2[i]) return parents1[i - 1]
	}
}

function click(e){
	let commonAncestor = getCommonAncestor(node.el, currentNode.el)

	if(
		node.el.parentElement === currentNode.el
		|| node.el === currentNode.el
		|| commonAncestor === node.el.parentElement
		|| commonAncestor === node.el
	){
		element.set(node)
		return e.stopPropagation()
	}
	e.preventDefault()
}

$: classes = node.classes.join(' ') ?? undefined
$: empty = node.children.length === 0
$: selected = node === currentNode
$: if(parentViewDesc) nodeView = nodeView

let el

let nodeView = new NodeViewDesc(parentViewDesc, [], null, node, parentViewDesc.view)

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
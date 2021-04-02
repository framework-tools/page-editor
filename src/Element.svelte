<script>
import ContentArray from './ContentArray.svelte'
import { tick } from 'svelte'
import { element } from './store'

export let item
let currentItem
element.subscribe(updatedItem => currentItem = updatedItem)
$: tag = item.tag

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
	let commonAncestor = getCommonAncestor(item.el, currentItem.el)

	if(
		item.el.parentElement === currentItem.el
		|| item.el === currentItem.el
		|| commonAncestor === item.el.parentElement
		|| commonAncestor === item.el
	){
		element.set(item)
		return e.stopPropagation()
	}
	e.preventDefault()
}

$: classes = item.classes.join(' ') ?? undefined
$: empty = item.children.length === 0
$: selected = item === currentItem
$: if(item.el) item.el.NodeView = item


</script>
<svelte:element
	{tag}
	class={classes}
	class:empty
	class:builder-selected={selected}
	bind:this={item.el}
	on:mousedown={click}
	>
	<ContentArray
		bind:parent={item}/>
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
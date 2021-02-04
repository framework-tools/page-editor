<script>
import ContentArray from './ContentArray.svelte'
import { tick } from 'svelte'
export let tag = 'div'
export let item
export let parent

$: item.parent = parent

import { element } from './store'

function click(){
	element.set([item, updatedItem => item = updatedItem])
}

$: empty = item.content.length === 0

</script>
<svelte:element
	tag={tag}
	class:empty
	bind:this={item.el}
	on:click|stopPropagation={click}
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
</style>
<svelte:options accessors={true}/>
<script>
	import Element from './Element.svelte'
	import TextElement from './TextElement.svelte'

	export let parent
</script>
{#each parent.content as item}
	{#if item.type !== 'text'}
		<Element
			tag={item.type}
			bind:item
			bind:parent
			/>
	{:else}
		<TextElement
			bind:item
			bind:parent
			/>
	{/if}
{/each}
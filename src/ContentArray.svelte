<script>
	import Element from './Element.svelte'
	import TextElement from './TextElement.svelte'

	export let parent
</script>
{#each parent.children as item}
	{#if !item.isText }
		<Element
			bind:item
			/>
	{:else}
		<TextElement
			bind:item
			/>
	{/if}
{/each}
<script>
	import TextNode from './TextNode.svelte'

	export let parentTree
</script>
{#each parentTree.children as tree}
	{#if !tree.node.isText }
		<svelte:component
			this={tree.node.component}
			bind:tree/>
	{:else}
		<TextNode bind:tree/>
	{/if}
{/each}
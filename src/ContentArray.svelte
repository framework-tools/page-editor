<script>
	import { tick } from 'svelte'

	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	export let parentViewDesc

	async function updateChildren(){
		await tick()
		parentViewDesc.updateChildren()
	}

	$: if(parentViewDesc.el) updateChildren()
</script>
{#each parentViewDesc.node.children as node, i}
	{#if !node.isText }
		<svelte:component
			this={node.component}
			bind:node
			bind:parentViewDesc/>
	{:else}
		{@html `<!--${i}-->${escapeHtml(node.text)}`}
	{/if}
{/each}
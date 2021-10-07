
<script>
    import { onMount } from 'svelte'
    export let tree

    $: node = tree.node

    let span
    let textNode

    $: if(node && textNode) {
        textNode.textContent = node.text
        tree.setFragment(textNode)
    }
    
    onMount(() => {
        textNode = document.createTextNode(node.text)
        span.parentNode.insertBefore(textNode, span)
        span.remove()
    })
</script>
<span bind:this={span}/>
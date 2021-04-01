
<script>
    export let item

    $: empty = item.text === ''

</script>
{#if !empty}
    {@html item.text}
{:else}
    <span
        contenteditable="true"
        class="placeholder"
        />
{/if}
<style>
    .placeholder {
        opacity: 0.5;
    }

    .placeholder::after{
        content: 'Enter some text';
    }
</style>

<script>
    export let item


    $: empty = item.text === ''

</script>
<span
    contenteditable="true"
    bind:innerHTML={item.text}
    class:placeholder={empty}
    />
<style>
    .placeholder {
        opacity: 0.5;
    }

    .placeholder::after{
        content: 'Enter some text';
    }
</style>
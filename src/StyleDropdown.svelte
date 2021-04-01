<script>
import PlusIcon from 'svelte-material-icons/Plus.svelte'
import ClassIcon from './ClassIcon.svelte'

let selected = false

function toggleStyleDropdown () {
    selected = !selected
}

export let stylesList
</script>
<div class="icon-button" class:selected on:click={toggleStyleDropdown}>
    <PlusIcon size="22px"/>
</div>
<style>
    .icon-button {
        border-radius: 2px;
        padding: 2px;
        display: inline-flex;
    }
    .icon-button.selected {
        background: #369FE9;
        color: white;
    }
</style>
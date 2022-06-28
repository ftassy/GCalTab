<script lang="ts">
    import { onMount } from "svelte";
    import type { Browser } from "./interfaces";

    export let onClick: Function;
    export let labelNameAndDivId: string;
    export let cssClass: string;
    export let iconSrc: string;
  
    // Define a synonym for browser so that Typescript does not 
    // panic.
    //@ts-ignore
    let browserApi: Browser = browser;

    let label: string;

    onMount(() => {
		// UI internationalization 
		label = browserApi.i18n.getMessage(labelNameAndDivId);
	});

    function onClickWrapper() {
        onClick();
    }
</script>

<div id={labelNameAndDivId}>
    <button class={"round-button " + cssClass} on:click={onClickWrapper}>
        <img src={iconSrc} width="22px" alt={label} title={label}>
    </button>
</div>
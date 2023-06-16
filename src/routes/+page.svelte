<script lang="ts">

    import SourcesConfig from "$lib/SourcesConfig.svelte";
    import FileLoader from "$lib/FileLoader.svelte";
	import EditorPanes from "$lib/EditorPanes.svelte";

    let log_text: string = "";

</script>

{#if log_text}
    <EditorPanes {log_text} />
{:else}
    <SourcesConfig />
    <FileLoader bind:text={log_text} title="Choose a log file" />
{/if}

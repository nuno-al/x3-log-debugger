<script lang="ts">

    import SourcesConfig from "./SourcesConfig.svelte";
    import FileLoader from "./FileLoader.svelte";
    import EditorPanes from "./EditorPanes.svelte";

    let log_text: string = "";

</script>

{#if log_text}
    <EditorPanes {log_text} />
{:else}
    <SourcesConfig />
    <FileLoader bind:text={log_text} title="Choose a log file" />
{/if}

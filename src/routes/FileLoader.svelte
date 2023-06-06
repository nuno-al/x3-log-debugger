<script lang="ts">

    import { open } from '@tauri-apps/api/dialog';
    import { readTextFile } from '@tauri-apps/api/fs';
    import { appDataDir } from '@tauri-apps/api/path';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    
    export let title: string = "Choose a file"
    export let text: string = "";
    let isLoading = false;
    
    async function loadFile(e: Event) {
        const selected = await open({
            directory: false,
            multiple: false,
            defaultPath: await appDataDir()
        });
        if (!selected) return;
        isLoading = true;
        text = await readTextFile(selected as string);
        isLoading = false;
    }
    
</script>

{#if isLoading}
    <ProgressRadial />
{:else}
    <button type="button" class="btn variant-filled" on:click={loadFile}>{title}</button>
{/if}
    
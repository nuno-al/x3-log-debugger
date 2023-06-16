<script lang="ts">

    import type { SourceInfo } from "$lib/sources_info";
    import { open } from '@tauri-apps/api/dialog';
    import { readDir, type FileEntry } from '@tauri-apps/api/fs';
    import { appDataDir } from '@tauri-apps/api/path';
    import { ProgressRadial, type ModalComponent, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import SourcesConfig from "$lib/SourcesConfig.svelte";
    
    export let title: string = "Choose sources directory"

    const PATTERN1: RegExp = /^.*?\/(\d+?)\/(\d+?)$/
    const temp_sources: SourceInfo[] = []

    const modal: ModalSettings = {
        type: 'component',
        component: {
            ref: SourcesConfig,
            props: {
                show_loader: false,
                temp_sources: temp_sources
            }
        }
    };

    let isLoading = false;

	function addToSource(path: string) {
        let new_source: SourceInfo = {
            version: -1,
            level: -1,
            path: path
        };
        let res;
        if ((res = PATTERN1.exec(path)) !== null) {
            new_source.version = parseInt(res[1]);
            new_source.level = parseInt(res[2]);
        }
        temp_sources.push(new_source);
	}

    function getLeafDirs(leaf_dirs: FileEntry[], entries: FileEntry[] | FileEntry) {
        if (Array.isArray(entries)) {
            for (const entry of entries) {
                getLeafDirs(leaf_dirs, entry);
            }
        } else if (entries.children) {
            const temp_leaf_dirs: FileEntry[] = []
            getLeafDirs(temp_leaf_dirs, entries.children);
            if (temp_leaf_dirs.length == 0) 
                leaf_dirs.push(entries);
            else
                leaf_dirs.push(...temp_leaf_dirs);
        }
    }

	async function loadSources(e: Event) {
        const selected = await open({
            directory: true,
            multiple: false,
            defaultPath: await appDataDir()
        });
        if (!selected) return;

        isLoading = true;
        const entries = await readDir(selected as string, { recursive: true });
        const leaf_dirs: FileEntry[] = [];
        getLeafDirs(leaf_dirs, entries);
        for (const dir of leaf_dirs) addToSource(dir.path);
        temp_sources.sort((a, b) => (a.version - b.version)*100 + (a.level - b.level));

        await modalStore.trigger(modal);
        saveSources();

        isLoading = false;
	}

    function saveSources() {
        console.log("save sources");
    }

</script>

{#if isLoading}
    <ProgressRadial />
{:else}
    <button type="button" class="btn variant-filled" on:click={loadSources}>{title}</button>
{/if}
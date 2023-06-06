<script lang="ts">

    import { sources_info as sources, type SourceInfo } from "./sources_info";
    import { open } from '@tauri-apps/api/dialog';
    import { appDataDir } from '@tauri-apps/api/path';
	import { readDir } from '@tauri-apps/api/fs';

    let isLoading = false;

	function addToSource(new_source: SourceInfo) {
		$sources = $sources.filter(e => e.path != new_source.path && (e.level != new_source.level || e.version != new_source.version ));
		$sources.push(new_source);
		$sources.sort();
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
		for (const entry of entries) {
			let version: number;
			if (entry.children && entry.name && !isNaN(version = parseInt(entry.name))) {
				for (const child of entry.children) {
					let level: number;
					if (child.children && child.name && !isNaN(level = parseInt(child.name))) {
						addToSource({
							level: level,
							version: version,
							path: child.path
						});
					}
				}
			}
		}
		$sources = $sources;
        isLoading = false;
	}
    
</script>

<button type="button" class="btn variant-filled" on:click={loadSources}>Choose sources directory</button>
{#if $sources && $sources.length > 0}
	<div class="table-container">
		<table class="table table-hover table-compact">
			<thead>
				<tr>
					<th>Version</th>
					<th>Level</th>
					<th>Path</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each $sources as row, i}
					<tr>
						<td>{row.version}</td>
						<td>{row.level}</td>
						<td>{row.path}</td>
						<td><button type="button" class="btn-icon btn-icon-sm variant-filled" on:click={() => { $sources.splice(i, 1); $sources = $sources; }}>X</button></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>    
{/if}
    
<script lang="ts">

    import { sources_info as sources, type SourceInfo } from "$lib/sources_info.js";
	import SourcesLoader from "$lib/SourcesLoader.svelte";

	export let temp_sources: SourceInfo[] = [];
	export let show_loader: boolean = true;

	function is_set(arr: any[]) {
		return arr && arr.length > 0
	}

	function sources_exist() {
		return is_set(temp_sources) || is_set($sources);
	}

	function get_sources() {
		return is_set(temp_sources) ? temp_sources : $sources;
	}

	function delete_sources_line(line: number) {
		if (is_set(temp_sources)) {
			temp_sources.splice(line, 1);
			temp_sources = temp_sources;
		} else if (is_set($sources)) {
			$sources.splice(line, 1);
			$sources = $sources;
		}
	}

	function save_sources() {
		if (is_set(temp_sources)) {
			console.log("save sources");
		}
	}
    
</script>

{#if show_loader}
	<SourcesLoader />
{/if}
{#if sources_exist()}
	<div class="table-container">
		<table class="table table-hover table-compact">
			<thead>
				<tr>
					<th>Path</th>
					<th class="table-cell-fit">Version</th>
					<th class="table-cell-fit">Level</th>
					<th class="table-cell-fit"></th>
				</tr>
			</thead>
			<tbody>
				{#each get_sources() as row, i}
					<tr>
						<td><input class="input" type="text" bind:value={row.path} /></td>
						<td class="table-cell-fit"><input class="input" type="number" bind:value={row.version} /></td>
						<td class="table-cell-fit"><input class="input" type="number" bind:value={row.level} /></td>
						<td class="table-cell-fit"><button type="button" class="btn-icon btn-icon-sm variant-filled" on:click={() => { delete_sources_line(i) }}>X</button></td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#if is_set(temp_sources)}
			<button type="button" class="btn variant-filled-primary" on:click={save_sources}>Save</button>
		{/if}

	</div>
{/if}
<style>
	.table {
		max-width: 60rem!important;
	}

	.table thead th, .table tbody td {
		padding: 0.1rem 0.5rem!important;
		vertical-align: middle!important;
	}

	.table tbody td input {
		padding-left: 0.6rem!important;
		padding-right: 0.6rem!important;
	}

	.table tbody td input:not(:focus-visible) {
		border: 0!important;
		background-color: transparent!important;
	}

	.table tbody td input[type=number] {
		text-align: right!important;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type=number] {
		-moz-appearance: textfield;
	}
</style>

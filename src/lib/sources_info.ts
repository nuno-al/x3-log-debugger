import { get } from 'svelte/store'
import { storable } from "$lib/storable";
import { readDir } from '@tauri-apps/api/fs';
import { path } from '@tauri-apps/api';

const sources_map: Map<string, [number, string][]>[] = [];
let isInitialized = false;

export type SourceInfo = {
    level: number,
    version: number,
    path: string
};

export const sources_info = storable<SourceInfo[]>('sources_info');

export async function initSources() {
    let sources_arr: [number, string][] | undefined;
    for (const sm of sources_map) sm?.clear();
    for (const source of get(sources_info)) {
        if (sources_map[source.version] === undefined) {
            sources_map[source.version] = new Map<string, [number, string][]>;
        }
        const entries = await readDir(source.path, { recursive: false });
        for (const entry of entries) {
            if (entry.name === undefined) continue;

            sources_arr = sources_map[source.version].get(entry.name);
            if (sources_arr === undefined) {
                sources_arr = [];
                sources_map[source.version].set(entry.name, sources_arr);
            }
            sources_arr.push([source.level, `${source.path}${path.sep}${entry.name}`]);
            sources_arr.sort((a, b) => b[0] - a[0]);
        }
    }
    isInitialized = true;
}

export function getSource(name: string, version: number, level: number): string {
    if (!isInitialized) initSources();
    return sources_map[version]?.get(`${name}.src`)?.find((v) => level < 0 || v[0] <= level)?.[1] || "";
}

<script lang="ts">
    
    import { readTextFile } from '@tauri-apps/api/fs';
    import { sources_info as sources, type SourceInfo, getSource, initSources } from "./sources_info";
    import { debug_info } from "./debug_info";
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import AceEditor from "./AceEditor.svelte";
    import type * as ace from "brace";
    import "brace/mode/html";
    import "./chrome";
	import { onMount } from "svelte";
    
    const PATTERN1: RegExp = /^<channel [123]>@(.+?)\.TRT\/(.+?)\$adx\((\d+)\).*$/
    const PATTERN2: RegExp = /^<channel 4>Execution SQL on (Read|For) clause in @(.+?)\.TRT\/(.+?)\$adx at line (\d+).*$/
    const PATTERN2_BEGIN: RegExp = /^<channel 4>/

    export let source_text: string = "";
    export let log_text: string = "";

    let source_editor: ace.Editor;
    let log_editor: ace.Editor;

    function changeCursor(e: CustomEvent<ace.Editor>) {
        let line_text = e.detail.getSession().getLine(e.detail.getCursorPosition().row);
        let res;
        if ((res = PATTERN1.exec(line_text)) !== null) {
            goToSourceLine(res[2], parseInt(res[3]));
        } else {
            for (let i = 0; PATTERN2_BEGIN.test(line_text) && i < 3; i++) {
                line_text = e.detail.getSession().getLine(e.detail.getCursorPosition().row - i);
                if ((res = PATTERN2.exec(line_text)) !== null) {
                    goToSourceLine(res[3], parseInt(res[4]));
                    break;
                }
            }
        }
    }

    async function goToSourceLine(source: string, line: number) {
        console.log(`goto ${source} => ${line}`);
        const file = getSource(source, $debug_info.version, $debug_info.level);
        console.log(file);
        source_text = await readTextFile(file);
        source_editor.gotoLine(line);
    }

    onMount(() => {
        initSources();
    });

</script>

<Splitpanes horizontal style="height: 100%">
    <Pane minSize={20} size={70}>
        <AceEditor width='100%' height='100%' readonly lang="text" theme="chrome" value={source_text}
            on:init={(e) => source_editor = e.detail}
        />
    </Pane>
    <Pane minSize={15} size={30}>
        <AceEditor width='100%' height='100%' readonly lang="html" theme="chrome" value={log_text}
            on:init={(e) => log_editor = e.detail}
            on:changeCursor={changeCursor}
        />
    </Pane>
</Splitpanes>

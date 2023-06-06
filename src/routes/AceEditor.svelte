<script lang="ts">
    import { createEventDispatcher, tick, onMount, onDestroy } from "svelte";
    import * as ace from "brace";
    import "brace/ext/emmet";
    const EDITOR_ID = `svelte-ace-editor-div:${Math.floor(
      Math.random() * 10000000000
    )}`;
    
    const dispatch = createEventDispatcher<{
      init: ace.Editor;
      input: string;
      selectionChange: any;
      blur: void;
      changeMode: any;
      commandKey: { err: any; hashId: any; keyCode: any };
      copy: void;
      changeCursor: ace.Editor;
      cut: void;
      documentChange: { data: any };
      focus: void;
      paste: string;
    }>();
    
    /**
     * translation of vue component to svelte:
     * @link https://github.com/chairuosen/vue2-ace-editor/blob/91051422b36482eaf94271f1a263afa4b998f099/index.js
     **/
    export let value: string = ""; // String, required
    export let lang: string = "json"; // String
    export let theme: string = "chrome"; // String
    export let height: string = "100%"; // null for 100, else integer, used as percent
    export let width: string = "100%"; // null for 100, else integer, used as percent
    export let options: any = {}; // Object
    export let readonly: boolean = false;
  
    const ValidPxDigitsRegEx = /^\d*$/;
    function px(n: string): string {
      if (ValidPxDigitsRegEx.test(n)) {
        return n + "px";
      }
      return n;
    }

    let editor: ace.Editor;
    let contentBackup: string = "";
  
    const requireEditorPlugins = () => {};
    requireEditorPlugins();
  
    onDestroy(() => {
      if (editor) {
        editor.destroy();
        editor.container.remove();
      }
    });
  
    $: watchValue(value);
    function watchValue(val: string) {
      if (contentBackup !== val && editor && typeof val === "string") {
        editor.session.setValue(val);
        contentBackup = val;
      }
    }
  
    $: watchTheme(theme);
    function watchTheme(newTheme: string) {
      if (editor) {
        editor.setTheme("ace/theme/" + newTheme);
      }
    }
  
    $: watchMode(lang);
    function watchMode(newOption: any) {
      if (editor) {
        editor.getSession().setMode("ace/mode/" + newOption);
      }
    }
  
    $: watchOptions(options);
    function watchOptions(newOption: any) {
      if (editor) {
        editor.setOptions(newOption);
      }
    }
  
    $: watchReadOnlyFlag(readonly);
    function watchReadOnlyFlag(flag: boolean) {
      if (editor) {
        editor.setReadOnly(flag);
      }
    }
  
    const resizeOnNextTick = () =>
      tick().then(() => {
        if (editor) {
          editor.resize();
        }
      });
  
    $: if (height !== null && width !== null) {
      resizeOnNextTick();
    }
  
    onMount(() => {
      lang = lang || "text";
      theme = theme || "chrome";
  
      editor = ace.edit(EDITOR_ID);

      dispatch("init", editor);
      editor.$blockScrolling = Infinity;
      // editor.setOption("enableEmmet", true);
      editor.getSession().setMode("ace/mode/" + lang);
      editor.setTheme("ace/theme/" + theme);
      editor.setValue(value, 1);
      editor.setReadOnly(readonly)
      contentBackup = value;
      setEventCallBacks();
      if (options) {
        editor.setOptions(options);
      }
    });
  
    function setEventCallBacks() {
        editor.session.selection.on('changeCursor', function(e: any) {
            dispatch("changeCursor", editor);
        });
        editor.on("change", function () {
            const content = editor.getValue();
            value = content;
            dispatch("input", content);
            contentBackup = content;
        });
    }
  </script>
  
  <div style="width:{px(width)};height:{px(height)}">
    <div id={EDITOR_ID} style="width:{px(width)};height:{px(height)}" />
  </div>
  
<script  lang="ts">
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	// This contains the bulk of Skeletons required styles:
	// NOTE: this will be renamed skeleton.css in the v2.x release.
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	import { AppShell, Modal } from '@skeletonlabs/skeleton';
</script>

<Modal />
<AppShell>
	<svelte:fragment slot="header">Header</svelte:fragment>
	<slot />
</AppShell>

<script lang="ts">
import './app.css';
import Layout from './main/Layout.svelte';
import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<main>
  <Layout />
</main>

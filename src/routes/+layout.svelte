<script lang="ts">
  import './app.css';

  let { children } = $props();
</script>

<nav>
  <a href="/">brackets</a>
</nav>

{@render children()}

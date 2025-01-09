<script lang="ts">
  import './app.css';

  import { enhance } from '$app/forms';
  import { fly, slide } from 'svelte/transition';
  import type { PageData, ActionData } from './$types';

  interface IProps {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: IProps = $props();
</script>

<div class="centered">
  <h1>brackets</h1>

  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}

  <form method="post" action="?/create" use:enhance>
    <label>
      add a bracket:
      <input name="name" value={form?.name ?? ''} autocomplete="off" required />
    </label>
  </form>

  <ul class="brackets">
    {#each data.brackets as bracket (bracket.id)}
      <li in:fly={{ y: 20 }} out:slide>
        <form method="post" action="?/delete" use:enhance>
          <input type="hidden" name="id" value={bracket.id} />
          <a href="/bracket/{bracket.id}">{bracket.name}</a>
          <button class="remove" aria-label="Delete"></button>
        </form>
      </li>
    {/each}
  </ul>
</div>

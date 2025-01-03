<script lang="ts">
  import { enhance } from '$app/forms';
  import { fly, slide } from 'svelte/transition';
  import type { Bracket } from '$lib/types';

  interface IProps {
    data: { brackets: Array<Bracket> };
    form: any;
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
          <span>{bracket.name}</span>
          <button aria-label="Delete"></button>
        </form>
      </li>
    {/each}
  </ul>
</div>

<style>
  .centered {
    max-width: 20em;
    margin: 0 auto;
  }

  label {
    width: 100%;
  }

  input {
    flex: 1;
  }

  span {
    flex: 1;
  }

  button {
    border: none;
    background: url(./remove.svg) no-repeat 50% 50%;
    background-size: 1rem 1rem;
    cursor: pointer;
    height: 100%;
    aspect-ratio: 1;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  button:hover {
    opacity: 1;
  }
</style>

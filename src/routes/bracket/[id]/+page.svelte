<script lang="ts">
  import { enhance } from '$app/forms';
  import { fly, slide } from 'svelte/transition';
  import Result from './Result.svelte';
  import type { PageData, ActionData } from './$types';

  interface IProps {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: IProps = $props();
</script>

<div class="centered">
  <h1>bracket {data.bracket.name}</h1>

  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}

  {#if data.competitors.length > 1}
    <a href="/bracket/{data.bracket.id}/match">go to match</a>
  {/if}

  <form method="post" action="?/create" use:enhance>
    <label>
      add a competitor:
      <input name="name" value={form?.name ?? ''} autocomplete="off" required />
    </label>
  </form>

  <h2>Competitors</h2>
  <ul class="competitors">
    {#each data.competitors as competitor (competitor.id)}
      <li in:fly={{ y: 20 }} out:slide>
        <form method="post" action="?/delete" use:enhance>
          <input type="hidden" name="id" value={competitor.id} />
          <span>{competitor.name}</span>
          <span>{competitor.elo}</span>
          <button class="remove" aria-label="Delete"></button>
        </form>
      </li>
    {/each}
  </ul>
  <h2>Results</h2>
  <ul>
    {#each data.results as result}
      <li in:fly={{ y: 20 }} out:slide>
        <Result {result} />
      </li>
    {/each}
  </ul>
</div>

<style>
  ul {
    padding: 0;
    list-style: none;
  }
  li {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }
</style>

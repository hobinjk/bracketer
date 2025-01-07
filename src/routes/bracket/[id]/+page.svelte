<script lang="ts">
  import { enhance } from '$app/forms';
  import { fly, slide } from 'svelte/transition';

  interface IProps {
    data: any;
    form: any;
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

  <ul class="brackets">
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
</div>

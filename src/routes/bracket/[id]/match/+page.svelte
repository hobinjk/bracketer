<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  interface IProps {
    data: PageData;
    form: ActionData;
  }
  let { data, form }: IProps = $props();
</script>

<div class="centered">
  <h1>{data.competitorA.name} vs {data.competitorB.name}</h1>

  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}

  <form method="post" action="?/create" use:enhance>
    <input type="hidden" name="competitorAId" value={data.competitorA.id} />
    <input type="hidden" name="competitorBId" value={data.competitorB.id} />

    <label for="win-a">
      <input type="radio" id="win-a" name="outcome" value="WIN_A" required />
      {data.competitorA?.name} Win
    </label>
    <label for="draw">
      <input type="radio" id="draw" name="outcome" value="DRAW" />
      Tie
    </label>
    <label for="win-b">
      <input type="radio" id="win-b" name="outcome" value="WIN_B" />
      {data.competitorB?.name} Win
    </label>

    <textarea name="notes" placeholder="Notes" value=""></textarea>
    <button>Submit</button>
  </form>
</div>

<style>
  label {
    flex: 1;
  }
</style>

<script lang="ts">
  import { enhance } from '$app/forms';

  interface IProps {
    data: any;
    form: any;
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

    <div style="flex: 1">
      <input type="radio" id="win-a" name="outcome" value="WIN_A" required />
      <label for="win-a">{data.competitorA?.name} Win</label>
    </div>
    <div style="flex: 1">
      <input type="radio" id="draw" name="outcome" value="DRAW" />
      <label for="draw">Tie</label>
    </div>
    <div style="flex: 1">
      <input type="radio" id="win-b" name="outcome" value="WIN_B" />
      <label for="win-b">{data.competitorB?.name} Win</label>
    </div>

    <textarea name="notes" placeholder="Notes" value={form?.notes ?? ''}></textarea>
    <button>Submit</button>
  </form>
</div>

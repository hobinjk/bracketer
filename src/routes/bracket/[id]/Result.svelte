<script lang="ts">
  import { Outcome } from '$lib/schema.ts';

  interface IProps {
    result: any;
  }

  let { result }: IProps = $props();
  let winner = $derived(result.outcome === Outcome.WIN_A ? result.competitorA : result.competitorB);
  let loser = $derived(result.outcome === Outcome.WIN_A ? result.competitorB : result.competitorA);
  let text = $derived(result.outcome === Outcome.DRAW ? 'tied' : 'defeated');
</script>

<span class="result">{winner.name} {text} {loser.name}</span>
<span class="result-notes {result.notes.length > 0 ? '' : 'noteless'}">
  {result.notes || 'no notes'}
</span>

<style>
  .result,
  .result-notes {
    flex: 1;
  }

  .result-notes.noteless {
    opacity: 0.5;
  }
</style>

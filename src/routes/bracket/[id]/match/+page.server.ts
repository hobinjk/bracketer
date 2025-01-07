import { fail, error, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/database.ts';
import type { PageServerLoad, RequestEvent } from '../$types';
import type { Outcome } from '$lib/schema';

export const load: PageServerLoad = async ({ params }) => {
  const bracketId = parseInt(params.id);

  let match = await db.getNewMatch(bracketId);
  console.log('yey match', match);
  if (!match) {
    error(404);
  }

  return {
    competitorA: match.competitorA,
    competitorB: match.competitorB,
  };
}

export const actions = {
  create: async ({ request, params }: RequestEvent) => {
    const data = await request.formData();
    const bracketId = parseInt(params.id);
    const compA = parseInt(data.get('competitorAId')!.toString());
    const compB = parseInt(data.get('competitorBId')!.toString());
    const outcome = data.get('outcome')!.toString();
    const notes = data.get('notes')!.toString();
    try {
      await db.createResult(bracketId, compA, compB, outcome as Outcome, notes);
    } catch (err: any) {
      return fail(422, {
        name: data.get('name'),
        error: err.message,
      });
    }
    throw redirect(303, `/bracket/${bracketId}`);
  },
};


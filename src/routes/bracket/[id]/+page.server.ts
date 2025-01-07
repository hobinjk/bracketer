import { fail, error } from '@sveltejs/kit';
import * as db from '$lib/server/database.ts';
import type { PageServerLoad, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const bracketId = parseInt(params.id);

  let bracket = await db.getBracket(bracketId);
  if (!bracket) {
    error(404);
  }

  const competitors = await db.getCompetitors(bracketId);
  const results = await db.getResults(bracketId);

  return {
    bracket,
    competitors,
    results,
  };
};

export const actions = {
  create: async ({ request, params }: RequestEvent) => {
    const data = await request.formData();
    const bracketId = parseInt(params.id);
    try {
      db.createCompetitor(bracketId, data.get('name')!.toString());
    } catch (err: any) {
      return fail(422, {
        name: data.get('name'),
        error: err.message,
      });
    }
  },
  delete: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    const competitorId = parseInt(data.get('id')!.toString())
    db.deleteCompetitor(competitorId);
  },
};

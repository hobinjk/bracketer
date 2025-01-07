import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/database.js';
import type { PageServerLoad, RequestEvent } from './$types';

export const load: PageServerLoad = async () => {
  // let id = cookies.get('userid');

  // if (!id) {
  //   id = crypto.randomUUID();
  //   cookies.set('userid', id, { path: '/' });
  // }

  return {
    brackets: await db.getBrackets()
  };
}

export const actions = {
  create: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    try {
      await db.createBracket(data.get('name')!.toString());
    } catch (err: any) {
      return fail(422, {
        name: data.get('name'),
        error: err.message,
      });
    }
  },
  delete: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    await db.deleteBracket(parseInt(data.get('id')!.toString()));
  },
};

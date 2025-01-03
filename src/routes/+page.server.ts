import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/database.js';

export function load({ cookies }) {
  let id = cookies.get('userid');

  if (!id) {
    id = crypto.randomUUID();
    cookies.set('userid', id, { path: '/' });
  }

  return {
    brackets: db.getBrackets(id)
  };
}

export const actions = {
  create: async ({cookies, request}) => {
    const data = await request.formData();
    try {
      db.createBracket(cookies.get('userid'), data.get('name'));
    } catch (err) {
      return fail(422, {
        name: data.get('name'),
        error: err.message,
      });
    }
  },
  delete: async ({cookies, request}) => {
    const data = await request.formData();
    db.deleteBracket(cookies.get('userid'), data.get('id'));
  },
};

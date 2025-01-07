import { sqliteTable } from 'drizzle-orm/sqlite-core';
import * as t from 'drizzle-orm/sqlite-core';

export enum Outcome {
  WIN_A = 'WIN_A',
  WIN_B = 'WIN_B',
  DRAW = 'DRAW',
}

export const brackets = sqliteTable('brackets', {
  id: t.int().primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
});

export const competitors = sqliteTable('competitors', {
  id: t.int().primaryKey({ autoIncrement: true }),
  bracketId: t.int().references(() => brackets.id),
  name: t.text().notNull(),
  elo: t.real().notNull(),
});

export const results = sqliteTable('results', {
  id: t.int().primaryKey({ autoIncrement: true }),
  bracketId: t.int().references(() => brackets.id),
  competitorAId: t.int().references(() => competitors.id),
  competitorBId: t.int().references(() => competitors.id),
  outcome: t.text({
    enum: [Outcome.WIN_A, Outcome.WIN_B, Outcome.DRAW],
  }).notNull(),
  notes: t.text().notNull(),
});

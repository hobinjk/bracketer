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
export type Bracket = typeof brackets.$inferSelect;

export const competitors = sqliteTable('competitors', {
  id: t.int().primaryKey({ autoIncrement: true }),
  bracketId: t.int().references(() => brackets.id).notNull(),
  name: t.text().notNull(),
  elo: t.real().notNull(),
});
export type Competitor = typeof competitors.$inferSelect;

export const results = sqliteTable('results', {
  id: t.int().primaryKey({ autoIncrement: true }),
  bracketId: t.int().references(() => brackets.id).notNull(),
  competitorAId: t.int().references(() => competitors.id).notNull(),
  competitorBId: t.int().references(() => competitors.id).notNull(),
  outcome: t.text({
    enum: [Outcome.WIN_A, Outcome.WIN_B, Outcome.DRAW],
  }).notNull(),
  notes: t.text().notNull(),
});
export type Result = typeof results.$inferSelect;

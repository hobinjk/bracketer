// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
import { db } from './db.ts';
import {
  brackets as bracketsTable,
  competitors as competitorsTable,
  results as resultsTable,
  Outcome,
  brackets
} from '../schema.ts';
import { eq } from 'drizzle-orm';

export async function getBrackets() {
  return await db.query.brackets.findMany();
}

export async function getCompetitors(bracketId: number) {
  return await db.query.competitors.findMany({
    where: eq(competitorsTable.bracketId, bracketId)
  });
}

export async function getCompetitor(competitorId: number) {
  return await db.query.competitors.findFirst({
    where: eq(competitorsTable.id, competitorId)
  });
}

export async function getResults(bracketId: number) {
  return await db.query.results.findMany({
    where: eq(resultsTable.bracketId, bracketId)
  });
}

export async function createBracket(name: string) {
  if (name === '') {
    throw new Error('bracket must have a name');
  }

  const existingBrackets = await db.query.brackets.findMany({
    where: eq(bracketsTable.name, name)
  });

  if (existingBrackets.length > 0) {
    throw new Error('bracket name must be unique');
  }

  await db.insert(bracketsTable).values({
    name,
  });
}

export async function deleteBracket(bracketId: number) {
  await db.delete(bracketsTable).where(eq(bracketsTable.id, bracketId));
}

export async function getBracket(bracketId: number) {
  let bracket = await db.query.brackets.findFirst({
    where: eq(bracketsTable.id, bracketId)
  });

  if (!bracket) {
    console.log('no bracket', bracketId);
    throw new Error(`bracket not found with id ${bracketId}`);
  }

  return bracket;
}
interface IValued<T> {
  value: number,
  competitor: T,
}
function randomChoiceWeighted<T>(valuedMap: { [id: string]: IValued<T> }): T {
  let values = Object.values(valuedMap);
  let totalValue = 0;
  let maxValue = 0;
  for (const v of values) {
    maxValue = Math.max(maxValue, v.value);
  }
  for (const v of values) {
    v.value = (maxValue - v.value) + 1;
    totalValue += v.value;
  }

  let choice = Math.random() * totalValue;
  for (const v of values) {
    if (choice <= v.value) {
      return v.competitor;
    }
    choice -= v.value;
  }
  return values[0].competitor;
}

export async function getNewMatch(bracketId: number) {
  let competitors = await getCompetitors(bracketId);
  if (competitors.length < 2) {
    console.log('too few!');
    throw new Error('too few competitors');
  }

  let results = await getResults(bracketId);

  interface IValuedCompetitor {
    competitor: any,
    value: number,
  }

  let valued: { [compId: string]: IValuedCompetitor } = {};
  for (const competitor of competitors) {
    valued[competitor.id] = {
      competitor,
      value: 0,
    };
  }

  for (let result of results) {
    valued[result.competitorAId].value += 1;
    valued[result.competitorBId].value += 1;
  }

  // first is random sorted by amount of involved results
  let competitorA = randomChoiceWeighted(valued);

  for (let key of Object.keys(valued)) {
    valued[key].value = 0;
  }
  delete valued[competitorA.id];

  for (let result of results) {
    if (result.competitorAId == competitorA.id) {
      // Increase goodness of other
      valued[result.competitorBId].value += 1;
    } else if (result.competitorBId == competitorA.id) {
      valued[result.competitorAId].value += 1;
    }
  }

  // second is random sorted by amount of both-involved results
  let competitorB = randomChoiceWeighted(valued);

  return {
    competitorA,
    competitorB,
  };
}

export async function createCompetitor(bracketId: number, name: string) {
  if (name === '') {
    throw new Error('competitor must have a name');
  }

  const bracket = await getBracket(bracketId);

  if (!bracket) {
    throw new Error('missing bracket');
  }

  const competitors = await getCompetitors(bracketId);

  if (competitors.find(comp => comp.name === name)) {
    throw new Error('competitors must be unique');
  }

  await db.insert(competitorsTable).values({
    bracketId,
    name,
    elo: 1000,
  });
}

export async function deleteCompetitor(competitorId: number) {
  await db.delete(competitorsTable).where(eq(competitorsTable.id, competitorId));
}

export async function createResult(bracketId: number, competitorAId: number, competitorBId: number, outcome: Outcome, notes: string) {
  await db.insert(resultsTable).values({
    bracketId,
    competitorAId,
    competitorBId,
    outcome,
    notes,
  });

  await applyResult(competitorAId, competitorBId, outcome);
}

async function applyResult(competitorAId: number, competitorBId: number, outcome: Outcome) {
  let competitorA = await getCompetitor(competitorAId);
  let competitorB = await getCompetitor(competitorBId);

  if (!competitorA || !competitorB) {
    console.error('missing competitor to apply result');
    return;
  }

  const rA = competitorA.elo;
  const rB = competitorB.elo;
  const eA = 1 / (1 + Math.pow(10, (rB - rA) / 480));
  const eB = 1 - eA;
  const maxChange = 48;
  let sA = 0.5;
  if (outcome === Outcome.WIN_A) {
    sA = 1;
  } else if (outcome === Outcome.WIN_B) {
    sA = 0;
  }
  const sB = 1 - sA;
  const rAChange = maxChange * (sA - eA);
  const rBChange = maxChange * (sB - eB);

  competitorA.elo += rAChange;
  competitorB.elo += rBChange;

  await db.update(competitorsTable)
    .set({ elo: competitorA.elo })
    .where(eq(competitorsTable.id, competitorAId));
  await db.update(competitorsTable)
    .set({ elo: competitorB.elo })
    .where(eq(competitorsTable.id, competitorBId));
}

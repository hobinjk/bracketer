// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
const db = new Map();

import {Bracket, Competitor} from '$lib/types.ts';

export function getBrackets(userId: string) {
  if (!db.get(userId)) {
    db.set(userId, []);
  }

  return db.get(userId).map(bracket => bracket.serialize());
}

export function createBracket(userId, name) {
  if (name === '') {
    throw new Error('brack must have a name');
  }

  const brackets = db.get(userId);

  if (brackets.find((todo) => todo.name === name)) {
    throw new Error('brackets must be unique');
  }

  brackets.push(new Bracket(name));
}

export function deleteBracket(userId, bracketId) {
  const brackets = db.get(userId);
  const index = brackets.findIndex((bracket) => bracket.id === bracketId);

  if (index !== -1) {
    brackets.splice(index, 1);
  }
}

export function getBracket(userId: string, bracketId: string) {
  let brackets = getBrackets(userId);
  return brackets.find(bracket => bracket.id === bracketId)?.serialize();
}

export function createCompetitor(userId, bracketId, name) {
  if (name === '') {
    throw new Error('competitor must have a name');
  }

  const bracket = getBracket(userId, bracketId);

  if (!bracket) {
    throw new Error('missing bracket');
  }

  if (bracket.competitors.find(comp => comp.name === name)) {
    throw new Error('competitors must be unique');
  }

  bracket.competitors.push(new Competitor(name));
}

export function deleteCompetitor(userId, bracketId, competitorId) {
  const bracket = getBracket(userId, bracketId);

  if (!bracket) {
    throw new Error('missing bracket');
  }

  const index = bracket.competitors.findIndex(comp => comp.id === competitorId);

  if (index !== -1) {
    bracket.competitors.splice(index, 1);
  }
}

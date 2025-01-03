export enum Outcome {
  WIN_A,
  WIN_B,
  // DRAW,
}

export class Result {
  competitorA: Competitor;
  competitorB: Competitor;
  outcome: Outcome;
  notes: string;

  constructor(competitorA, competitorB, outcome, notes) {
    this.competitorA = competitorA;
    this.competitorB = competitorB;
    this.outcome = outcome;
    this.notes = notes;
  }

  applyEloChanges() {
    const rA = this.competitorA.elo;
    const rB = this.competitorB.elo;
    const eA = 1 / (1 + Math.pow(10, (rB - rA) / 480));
    const eB = 1 - eA;
    const maxChange = 48;
    let sA = 0.5;
    if (this.result === Result.WIN_A) {
      sA = 1;
    } else if (this.result === Result.WIN_B) {
      sA = 0;
    }
    const sB = 1 - sA;
    const rAChange = maxChange * (sA - eA);
    const rBChange = maxChange * (sB - eB);

    this.competitorA.elo += rAChange;
    this.competitorB.elo += rBChange;
  }

  serialize() {
    return {
      competitorA: this.competitorA.name,
      competitorB: this.competitorB.name,
      outcome: this.outcome,
      notes: this.notes,
    }
  }
}

export class Competitor {
  name: string;
  elo: number = 1000;

  constructor(name) {
    this.name = name;
  }

  serialize() {
    return {
      name: this.name,
      elo: this.elo,
    };
  }
}

export class Bracket {
  id: string;
  name: string;
  competitors: Array<Competitor> = []
  results: Array<Result> = [];

  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name;
  }

  addResult(competitorA, competitorB, outcome, notes) {
    let result = new Result(competitorA, competitorB, outcome, notes);
    this.results.push(result);
    result.applyEloChanges();
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      competitors: this.competitors.map(comp => comp.serialize()),
      results: this.results.map(result => result.serialize()),
    };
  }
}

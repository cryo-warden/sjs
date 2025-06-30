import { createMatrix, dotProduct } from "../math";
import { ConvertTuple, KeyOfTuple } from "../type";

export type JobEvaluation = [
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export const VALUE_NAMES = [
  "DAMAGE",
  "SURVIVAL",
  "ROD",
  "HEAL",
  "BUFF",
  "DEBUFF",
  "SHIELD",
] as const;

export const VALUE_INDEX = {
  DAMAGE: 0,
  SURVIVAL: 1,
  ROD: 2,
  HEAL: 3,
  BUFF: 4,
  DEBUFF: 5,
  SHIELD: 6,
} as const;

type JobEvaluationSpec = {
  [key in (typeof VALUE_NAMES)[number]]: number;
};

const createJobEvaluation = (
  spec: Partial<JobEvaluationSpec>
): JobEvaluation => {
  return VALUE_NAMES.map((name) => spec[name] ?? 0) as JobEvaluation;
};

export const JOB_NAMES = [
  "FREELANCER",
  "KNIGHT",
  "MONK",
  "THIEF",
  "DRAGOON",
  "NINJA",
  "SAMURAI",
  "BERSERKER",
  "RANGER",
  "MYSTIC_KNIGHT",
  "WHITE_MAGE",
  "BLACK_MAGE",
  "TIME_MAGE",
  "SUMMONER",
  "BLUE_MAGE",
  "RED_MAGE",
  "BEASTMASTER",
  "CHEMIST",
  "GEOMANCER",
  "BARD",
  "DANCER",
  "ORACLE",
  "CANNONEER",
  "GLADIATOR",
  "NECROMANCER",
  "MIME",
] as const;

export type JobId = KeyOfTuple<typeof JOB_NAMES>;
export type JobName = (typeof JOB_NAMES)[number];

export type JobSelectionCriteria = ConvertTuple<
  typeof JOB_NAMES,
  {
    allowedCount: number;
  }
>;

export type ABC = ConvertTuple<
  [1, 2, 3],
  {
    allowedCount: number;
  }
>;

const JOB = {
  FREELANCER: createJobEvaluation({
    DAMAGE: 100,
    SURVIVAL: 100,
    ROD: 100,
    SHIELD: 100,
  }),
  KNIGHT: createJobEvaluation({ DAMAGE: 90, SURVIVAL: 100, SHIELD: 100 }),
  MONK: createJobEvaluation({ DAMAGE: 50, SURVIVAL: 80 }),
  THIEF: createJobEvaluation({ DAMAGE: 40, SURVIVAL: 20 }),
  DRAGOON: createJobEvaluation({ DAMAGE: 50, SURVIVAL: 100, SHIELD: 100 }),
  NINJA: createJobEvaluation({
    DAMAGE: 120,
    SURVIVAL: 50,
    ROD: 50,
    BUFF: 10,
  }),
  SAMURAI: createJobEvaluation({ DAMAGE: 100, SURVIVAL: 100 }),
  BERSERKER: createJobEvaluation({ DAMAGE: 80, SURVIVAL: 40, HEAL: -40 }),
  RANGER: createJobEvaluation({ DAMAGE: 120, SURVIVAL: 50 }),
  MYSTIC_KNIGHT: createJobEvaluation({
    DAMAGE: 100,
    SURVIVAL: 40,
    DEBUFF: 100,
  }),
  WHITE_MAGE: createJobEvaluation({
    DAMAGE: 80,
    SURVIVAL: 50,
    HEAL: 100,
    BUFF: 80,
    DEBUFF: 50,
  }),
  BLACK_MAGE: createJobEvaluation({ DAMAGE: 100, SURVIVAL: 50, ROD: 90 }),
  TIME_MAGE: createJobEvaluation({
    DAMAGE: 90,
    SURVIVAL: 50,
    ROD: 80,
    HEAL: 10,
    BUFF: 50,
    DEBUFF: 90,
  }),
  SUMMONER: createJobEvaluation({
    DAMAGE: 90,
    SURVIVAL: 50,
    ROD: 100,
    HEAL: 10,
    BUFF: 80,
    DEBUFF: 10,
  }),
  BLUE_MAGE: createJobEvaluation({
    DAMAGE: 100,
    SURVIVAL: 50,
    ROD: 70,
    HEAL: 60,
    BUFF: 80,
    SHIELD: 100,
  }),
  RED_MAGE: createJobEvaluation({
    DAMAGE: 30,
    SURVIVAL: 30,
    ROD: 70,
    HEAL: 40,
    BUFF: 50,
    DEBUFF: 50,
  }),
  BEASTMASTER: createJobEvaluation({
    DAMAGE: 80,
    DEBUFF: 70,
  }),
  CHEMIST: createJobEvaluation({
    DAMAGE: 140,
    SURVIVAL: 50,
    BUFF: 120,
    DEBUFF: 50,
  }),
  GEOMANCER: createJobEvaluation({
    DAMAGE: 70,
    SURVIVAL: 50,
    HEAL: 30,
    DEBUFF: 30,
  }),
  BARD: createJobEvaluation({
    DAMAGE: 30,
    HEAL: 10,
    BUFF: 90,
    DEBUFF: 80,
  }),
  DANCER: createJobEvaluation({
    DAMAGE: 80,
    SURVIVAL: 50,
    HEAL: 20,
  }),
  ORACLE: createJobEvaluation({}),
  CANNONEER: createJobEvaluation({}),
  GLADIATOR: createJobEvaluation({}),
  NECROMANCER: createJobEvaluation({}),
  MIME: createJobEvaluation({
    DAMAGE: 100,
    SURVIVAL: 100,
    ROD: 100,
    HEAL: 20,
    BUFF: 20,
    DEBUFF: 20,
  }),
} as const satisfies {
  [key in JobName]: JobEvaluation;
};

const defaultEvaluationWeights: JobEvaluation = createJobEvaluation({
  DAMAGE: 4,
  SURVIVAL: 1.25,
  ROD: 2,
  HEAL: 2,
  BUFF: 1,
  DEBUFF: 1,
  SHIELD: 1.5,
});

export const evaluateJobs = (evaluationWeights = defaultEvaluationWeights) => {
  return JOB_NAMES.map((name) => {
    const job = JOB[name];
    return [name, dotProduct(job, evaluationWeights) / job.length] as const;
  });
};

export const evaluateJobsRanked = (
  evaluationWeights = defaultEvaluationWeights
) => evaluateJobs(evaluationWeights).sort((a, b) => b[1] - a[1]);

export const sandbox = () => {
  console.table(createMatrix(3, 4, (i, j) => `${i}, ${j}`));
  console.table(createMatrix(3, 4, () => 1));
  console.table(evaluateJobs());
  console.table(evaluateJobsRanked());
};

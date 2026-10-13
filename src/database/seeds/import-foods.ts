import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import dataSource from '../database.config';

type CsvRow = Record<string, string>;

const CSV_DIR = process.env.FOOD_CSV_DIR || join(process.cwd(), 'data');
const COMPOSITION_FILE = 'taco_composicao.csv';
const FATTY_ACIDS_FILE = 'taco_acidos_graxos.csv';
const AMINO_ACIDS_FILE = 'taco_aminoacidos.csv';
const HOUSEHOLD_MEASURES_FILE = 'pof_medidas_caseiras.csv';
const CHUNK_SIZE = 500;

function loadCsv(filename: string): CsvRow[] {
  const raw = readFileSync(join(CSV_DIR, filename), 'utf8');
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CsvRow[];
}

function numeric(value: string | undefined): string | null {
  if (value == null || value.trim() === '') {
    return null;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric value: ${value}`);
  }
  return value;
}

function emptyToNull(value: string | undefined): string | null {
  if (value == null || value.trim() === '') {
    return null;
  }
  return value;
}

async function upsertChunk(
  insertPrefix: string,
  conflictSql: string,
  rows: unknown[][],
  columnCount: number,
): Promise<void> {
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);
    const values: string[] = [];
    const params: unknown[] = [];
    chunk.forEach((row, rowIndex) => {
      const offset = rowIndex * columnCount;
      const placeholders = row.map((_, colIndex) => `$${offset + colIndex + 1}`);
      values.push(`(${placeholders.join(', ')})`);
      params.push(...row);
    });
    await dataSource.query(
      `${insertPrefix} VALUES ${values.join(', ')} ${conflictSql}`,
      params,
    );
  }
}

async function importFoods(): Promise<number> {
  const rows = loadCsv(COMPOSITION_FILE);
  const insertPrefix = `
    INSERT INTO foods (
      taco_id, description, umidade_pct, energia_kcal, energia_kj, proteina_g,
      lipideos_g, colesterol_mg, carboidrato_g, fibra_g, cinzas_g, calcio_mg,
      magnesio_mg, manganes_mg, fosforo_mg, ferro_mg, sodio_mg, potassio_mg,
      cobre_mg, zinco_mg, retinol_mcg, re_mcg, rae_mcg, tiamina_mg,
      riboflavina_mg, piridoxina_mg, niacina_mg, vitamina_c_mg, food_base,
      preparation, qualifiers, category, nutrient_basis, source, source_file
    )
  `;
  const conflictSql = `
    ON CONFLICT (taco_id) DO UPDATE SET
      description = EXCLUDED.description,
      umidade_pct = EXCLUDED.umidade_pct,
      energia_kcal = EXCLUDED.energia_kcal,
      energia_kj = EXCLUDED.energia_kj,
      proteina_g = EXCLUDED.proteina_g,
      lipideos_g = EXCLUDED.lipideos_g,
      colesterol_mg = EXCLUDED.colesterol_mg,
      carboidrato_g = EXCLUDED.carboidrato_g,
      fibra_g = EXCLUDED.fibra_g,
      cinzas_g = EXCLUDED.cinzas_g,
      calcio_mg = EXCLUDED.calcio_mg,
      magnesio_mg = EXCLUDED.magnesio_mg,
      manganes_mg = EXCLUDED.manganes_mg,
      fosforo_mg = EXCLUDED.fosforo_mg,
      ferro_mg = EXCLUDED.ferro_mg,
      sodio_mg = EXCLUDED.sodio_mg,
      potassio_mg = EXCLUDED.potassio_mg,
      cobre_mg = EXCLUDED.cobre_mg,
      zinco_mg = EXCLUDED.zinco_mg,
      retinol_mcg = EXCLUDED.retinol_mcg,
      re_mcg = EXCLUDED.re_mcg,
      rae_mcg = EXCLUDED.rae_mcg,
      tiamina_mg = EXCLUDED.tiamina_mg,
      riboflavina_mg = EXCLUDED.riboflavina_mg,
      piridoxina_mg = EXCLUDED.piridoxina_mg,
      niacina_mg = EXCLUDED.niacina_mg,
      vitamina_c_mg = EXCLUDED.vitamina_c_mg,
      food_base = EXCLUDED.food_base,
      preparation = EXCLUDED.preparation,
      qualifiers = EXCLUDED.qualifiers,
      category = EXCLUDED.category,
      source_file = EXCLUDED.source_file,
      updated_at = now()
  `;

  await upsertChunk(
    insertPrefix,
    conflictSql,
    rows.map((row) => [
      Number(row.numero_alimento),
      row.descricao,
      numeric(row.umidade_pct),
      numeric(row.energia_kcal),
      numeric(row.energia_kj),
      numeric(row.proteina_g),
      numeric(row.lipideos_g),
      numeric(row.colesterol_mg),
      numeric(row.carboidrato_g),
      numeric(row.fibra_g),
      numeric(row.cinzas_g),
      numeric(row.calcio_mg),
      numeric(row.magnesio_mg),
      numeric(row.manganes_mg),
      numeric(row.fosforo_mg),
      numeric(row.ferro_mg),
      numeric(row.sodio_mg),
      numeric(row.potassio_mg),
      numeric(row.cobre_mg),
      numeric(row.zinco_mg),
      numeric(row.retinol_mcg),
      numeric(row.RE_mcg),
      numeric(row.RAE_mcg),
      numeric(row.tiamina_mg),
      numeric(row.riboflavina_mg),
      numeric(row.piridoxina_mg),
      numeric(row.niacina_mg),
      numeric(row.vitamina_c_mg),
      emptyToNull(row.base),
      emptyToNull(row.preparo),
      emptyToNull(row.qualificadores),
      row.categoria,
      '100g',
      'taco',
      COMPOSITION_FILE,
    ]),
    35,
  );

  return rows.length;
}

async function tacoIdToFoodId(): Promise<Map<number, number>> {
  const records = (await dataSource.query(
    `SELECT id, taco_id FROM foods`,
  )) as Array<{ id: number; taco_id: number }>;
  return new Map(records.map((row) => [Number(row.taco_id), Number(row.id)]));
}

async function importFattyAcids(foodIds: Map<number, number>): Promise<number> {
  const rows = loadCsv(FATTY_ACIDS_FILE);
  const insertPrefix = `
    INSERT INTO food_fatty_acids (
      food_id, taco_id, saturados_g, monoinsaturados_g, poliinsaturados_g,
      c12_0_g, c14_0_g, c16_0_g, c18_0_g, c20_0_g, c22_0_g, c24_0_g, c14_1_g,
      c16_1_g, c18_1_g, c20_1_g, c18_2n6_g, c18_3n3_g, c20_4_g, c20_5_g,
      c22_5_g, c22_6_g, c18_1t_g, c18_2t_g, source, source_file
    )
  `;
  const conflictSql = `
    ON CONFLICT (taco_id) DO UPDATE SET
      food_id = EXCLUDED.food_id,
      saturados_g = EXCLUDED.saturados_g,
      monoinsaturados_g = EXCLUDED.monoinsaturados_g,
      poliinsaturados_g = EXCLUDED.poliinsaturados_g,
      c12_0_g = EXCLUDED.c12_0_g,
      c14_0_g = EXCLUDED.c14_0_g,
      c16_0_g = EXCLUDED.c16_0_g,
      c18_0_g = EXCLUDED.c18_0_g,
      c20_0_g = EXCLUDED.c20_0_g,
      c22_0_g = EXCLUDED.c22_0_g,
      c24_0_g = EXCLUDED.c24_0_g,
      c14_1_g = EXCLUDED.c14_1_g,
      c16_1_g = EXCLUDED.c16_1_g,
      c18_1_g = EXCLUDED.c18_1_g,
      c20_1_g = EXCLUDED.c20_1_g,
      c18_2n6_g = EXCLUDED.c18_2n6_g,
      c18_3n3_g = EXCLUDED.c18_3n3_g,
      c20_4_g = EXCLUDED.c20_4_g,
      c20_5_g = EXCLUDED.c20_5_g,
      c22_5_g = EXCLUDED.c22_5_g,
      c22_6_g = EXCLUDED.c22_6_g,
      c18_1t_g = EXCLUDED.c18_1t_g,
      c18_2t_g = EXCLUDED.c18_2t_g,
      source_file = EXCLUDED.source_file,
      updated_at = now()
  `;

  await upsertChunk(
    insertPrefix,
    conflictSql,
    rows.map((row) => {
      const tacoId = Number(row.numero_alimento);
      const foodId = foodIds.get(tacoId);
      if (!foodId) {
        throw new Error(`Fatty acids row ${tacoId} has no matching food`);
      }
      return [
        foodId,
        tacoId,
        numeric(row.saturados_g),
        numeric(row.monoinsaturados_g),
        numeric(row.poliinsaturados_g),
        numeric(row.c12_0_g),
        numeric(row.c14_0_g),
        numeric(row.c16_0_g),
        numeric(row.c18_0_g),
        numeric(row.c20_0_g),
        numeric(row.c22_0_g),
        numeric(row.c24_0_g),
        numeric(row.c14_1_g),
        numeric(row.c16_1_g),
        numeric(row.c18_1_g),
        numeric(row.c20_1_g),
        numeric(row.c18_2n6_g),
        numeric(row.c18_3n3_g),
        numeric(row.c20_4_g),
        numeric(row.c20_5_g),
        numeric(row.c22_5_g),
        numeric(row.c22_6_g),
        numeric(row.c18_1t_g),
        numeric(row.c18_2t_g),
        'taco',
        FATTY_ACIDS_FILE,
      ];
    }),
    26,
  );

  return rows.length;
}

async function importAminoAcids(foodIds: Map<number, number>): Promise<number> {
  const rows = loadCsv(AMINO_ACIDS_FILE);
  const insertPrefix = `
    INSERT INTO food_amino_acids (
      food_id, taco_id, triptofano_g, treonina_g, isoleucina_g, leucina_g,
      lisina_g, metionina_g, cistina_g, fenilalanina_g, tirosina_g, valina_g,
      arginina_g, histidina_g, alanina_g, acido_aspartico_g, acido_glutamico_g,
      glicina_g, prolina_g, serina_g, source, source_file
    )
  `;
  const conflictSql = `
    ON CONFLICT (taco_id) DO UPDATE SET
      food_id = EXCLUDED.food_id,
      triptofano_g = EXCLUDED.triptofano_g,
      treonina_g = EXCLUDED.treonina_g,
      isoleucina_g = EXCLUDED.isoleucina_g,
      leucina_g = EXCLUDED.leucina_g,
      lisina_g = EXCLUDED.lisina_g,
      metionina_g = EXCLUDED.metionina_g,
      cistina_g = EXCLUDED.cistina_g,
      fenilalanina_g = EXCLUDED.fenilalanina_g,
      tirosina_g = EXCLUDED.tirosina_g,
      valina_g = EXCLUDED.valina_g,
      arginina_g = EXCLUDED.arginina_g,
      histidina_g = EXCLUDED.histidina_g,
      alanina_g = EXCLUDED.alanina_g,
      acido_aspartico_g = EXCLUDED.acido_aspartico_g,
      acido_glutamico_g = EXCLUDED.acido_glutamico_g,
      glicina_g = EXCLUDED.glicina_g,
      prolina_g = EXCLUDED.prolina_g,
      serina_g = EXCLUDED.serina_g,
      source_file = EXCLUDED.source_file,
      updated_at = now()
  `;

  await upsertChunk(
    insertPrefix,
    conflictSql,
    rows.map((row) => {
      const tacoId = Number(row.numero_alimento);
      const foodId = foodIds.get(tacoId);
      if (!foodId) {
        throw new Error(`Amino acids row ${tacoId} has no matching food`);
      }
      return [
        foodId,
        tacoId,
        numeric(row.triptofano_g),
        numeric(row.treonina_g),
        numeric(row.isoleucina_g),
        numeric(row.leucina_g),
        numeric(row.lisina_g),
        numeric(row.metionina_g),
        numeric(row.cistina_g),
        numeric(row.fenilalanina_g),
        numeric(row.tirosina_g),
        numeric(row.valina_g),
        numeric(row.arginina_g),
        numeric(row.histidina_g),
        numeric(row.alanina_g),
        numeric(row.acido_aspartico_g),
        numeric(row.acido_glutamico_g),
        numeric(row.glicina_g),
        numeric(row.prolina_g),
        numeric(row.serina_g),
        'taco',
        AMINO_ACIDS_FILE,
      ];
    }),
    22,
  );

  return rows.length;
}

async function importHouseholdMeasures(): Promise<number> {
  const rows = loadCsv(HOUSEHOLD_MEASURES_FILE);
  const insertPrefix = `
    INSERT INTO food_household_measures (
      pof_food_code, food_description, preparation_code, preparation_description,
      measure_code, measure_description, reference_measure_code,
      reference_measure_description, quantity_g, source_code, source_description,
      source, source_file
    )
  `;
  const conflictSql = `
    ON CONFLICT (pof_food_code, preparation_code, measure_code) DO UPDATE SET
      food_description = EXCLUDED.food_description,
      preparation_description = EXCLUDED.preparation_description,
      measure_description = EXCLUDED.measure_description,
      reference_measure_code = EXCLUDED.reference_measure_code,
      reference_measure_description = EXCLUDED.reference_measure_description,
      quantity_g = EXCLUDED.quantity_g,
      source_code = EXCLUDED.source_code,
      source_description = EXCLUDED.source_description,
      source_file = EXCLUDED.source_file,
      updated_at = now()
  `;

  await upsertChunk(
    insertPrefix,
    conflictSql,
    rows.map((row) => [
      row.codigo_alimento,
      row.descricao_alimento,
      row.codigo_preparacao,
      row.descricao_preparacao,
      row.codigo_medida,
      row.descricao_medida,
      emptyToNull(row.codigo_medida_referencia),
      emptyToNull(row.descricao_medida_referencia),
      numeric(row.quantidade_g),
      emptyToNull(row.codigo_fonte),
      emptyToNull(row.descricao_fonte),
      'pof',
      HOUSEHOLD_MEASURES_FILE,
    ]),
    13,
  );

  return rows.length;
}

async function assertCounts(expected: {
  foods: number;
  fattyAcids: number;
  aminoAcids: number;
  householdMeasures: number;
}): Promise<void> {
  const [{ count: foods }] = (await dataSource.query(
    `SELECT COUNT(*)::int AS count FROM foods`,
  )) as Array<{ count: number }>;
  const [{ count: fattyAcids }] = (await dataSource.query(
    `SELECT COUNT(*)::int AS count FROM food_fatty_acids`,
  )) as Array<{ count: number }>;
  const [{ count: aminoAcids }] = (await dataSource.query(
    `SELECT COUNT(*)::int AS count FROM food_amino_acids`,
  )) as Array<{ count: number }>;
  const [{ count: householdMeasures }] = (await dataSource.query(
    `SELECT COUNT(*)::int AS count FROM food_household_measures`,
  )) as Array<{ count: number }>;

  const actual = { foods, fattyAcids, aminoAcids, householdMeasures };
  for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
    if (actual[key] !== expected[key]) {
      throw new Error(
        `Import count mismatch for ${key}: expected ${expected[key]}, got ${actual[key]}`,
      );
    }
  }
}

async function run(): Promise<void> {
  await dataSource.initialize();
  try {
    const foods = await importFoods();
    const foodIds = await tacoIdToFoodId();
    const fattyAcids = await importFattyAcids(foodIds);
    const aminoAcids = await importAminoAcids(foodIds);
    const householdMeasures = await importHouseholdMeasures();
    await assertCounts({ foods, fattyAcids, aminoAcids, householdMeasures });
    console.log('Food catalog import complete', {
      foods,
      fattyAcids,
      aminoAcids,
      householdMeasures,
    });
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

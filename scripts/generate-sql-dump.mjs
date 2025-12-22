import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import companiesData from '../companies.ts';
import { sheetsData } from '../sheets.ts';
import { problems } from '../platform_data.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const BATCH_SIZE = 1000; // Rows per INSERT statement

// --- Helper: SQL Escaping ---
function escapeSql(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString();
  if (Array.isArray(value)) {
    return `ARRAY[${value.map(v => escapeSql(v)).join(', ')}]`;
  }
  if (typeof value === 'string') {
    // Optimized string replacement
    return `'${value.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
  }
  return `'${JSON.stringify(value).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

// --- Helper: Slugify ---
function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- Class: Batch Writer ---
// Handles buffering rows and writing bulk INSERT statements
class SqlBatchWriter {
  constructor(stream, tableName, columns, onConflict = 'ON CONFLICT DO NOTHING') {
    this.buffer = [];
    this.stream = stream;
    this.tableName = `"${tableName}"`;
    this.columns = columns.map(c => `"${c}"`).join(', ');
    this.onConflict = onConflict;
  }

  add(values) {
    const row = `(${values.map(escapeSql).join(', ')})`;
    this.buffer.push(row);

    if (this.buffer.length >= BATCH_SIZE) {
      this.flush();
    }
  }

  flush() {
    if (this.buffer.length === 0) return;

    const statement = `INSERT INTO ${this.tableName} (${this.columns}) VALUES \n` +
                      this.buffer.join(',\n') +
                      `\n${this.onConflict};\n\n`;

    this.stream.write(statement);
    this.buffer = [];
  }
}

async function generateSqlDump() {
  console.log('Starting SQL dump generation...');
  const outputPath = path.join(__dirname, '..', 'seed-data.sql');
  const stream = fs.createWriteStream(outputPath);

  // 1. Header
  stream.write('-- Generated SQL Dump for PrepFlow Database\n');
  stream.write(`-- Generated at: ${new Date().toISOString()}\n\n`);
  stream.write('BEGIN;\n\n');

  // 2. Data Preparation (Extract Uniques)
  console.log('Analyzing data structure...');
  const uniqueTopics = new Set();
  const uniqueMainTopics = new Set();
  const uniqueTopicSlugs = new Set();
  const uniqueCompanies = new Map();

  // Maps for ID lookups
  const topicMap = new Map();
  const mainTopicMap = new Map();
  const topicSlugMap = new Map();
  const companyMap = new Map();
  const problemMap = new Map();
  const sheetMap = new Map();

  const seenSlugs = new Set();
  problems.forEach(p => {
    p.topicTags.forEach(tag => uniqueTopics.add(tag));
    p.mainTopics.forEach(topic => uniqueMainTopics.add(topic));
    p.topicSlugs.forEach(slug => uniqueTopicSlugs.add(slug));
    p.companyTags.forEach(company => {
      const slug = toSlug(company);
      // Only add if we haven't seen this slug before
      if (!seenSlugs.has(slug)) {
        const companyData = companiesData.find(c => c.name === company);
        uniqueCompanies.set(slug, {
          name: company,
          slug: slug,
          image: companyData?.image
        });
        seenSlugs.add(slug);
      }
    });
  });

  // 3. Initialize Writers
  const topicWriter = new SqlBatchWriter(stream, 'ProblemTopic', ['id', 'name'], 'ON CONFLICT (name) DO NOTHING');
  const mainTopicWriter = new SqlBatchWriter(stream, 'ProblemMainTopic', ['id', 'name'], 'ON CONFLICT (name) DO NOTHING');
  const slugWriter = new SqlBatchWriter(stream, 'ProblemTopicSlug', ['id', 'slug'], 'ON CONFLICT (slug) DO NOTHING');
  const companyWriter = new SqlBatchWriter(stream, 'ProblemCompany', ['id', 'name', 'slug', 'image'], 'ON CONFLICT (slug) DO NOTHING');
  const problemWriter = new SqlBatchWriter(stream, 'Problem',
    ['id', 'title', 'slug', 'isPremium', 'dislikes', 'likes', 'difficulty', 'url', 'accepted', 'submissions', 'acceptanceRate', 'platform'],
    'ON CONFLICT (slug) DO NOTHING'
  );

  // Relation Writers (Prisma many-to-many usually uses "A", "B")
  const relProblemTopic = new SqlBatchWriter(stream, '_ProblemTopicProblems', ['A', 'B']);
  const relProblemCompany = new SqlBatchWriter(stream, '_ProblemCompanyProblems', ['A', 'B']);
  const relProblemMainTopic = new SqlBatchWriter(stream, '_ProblemMainTopicProblems', ['A', 'B']);
  const relProblemSlug = new SqlBatchWriter(stream, '_ProblemTopicSlugProblems', ['A', 'B']);
  const similarWriter = new SqlBatchWriter(stream, 'SimilarProblem', ['id', 'problemId', 'similarId']);

  // 4. Write Lookup Tables
  console.log('Writing lookup tables...');

  let topicId = 1;
  for (const topic of uniqueTopics) {
    topicMap.set(topic, topicId);
    topicWriter.add([topicId++, topic]);
  }
  topicWriter.flush();

  let mainTopicId = 1;
  for (const topic of uniqueMainTopics) {
    mainTopicMap.set(topic, mainTopicId);
    mainTopicWriter.add([mainTopicId++, topic]);
  }
  mainTopicWriter.flush();

  let topicSlugId = 1;
  for (const slug of uniqueTopicSlugs) {
    topicSlugMap.set(slug, topicSlugId);
    slugWriter.add([topicSlugId++, slug]);
  }
  slugWriter.flush();

  let companyId = 1;
  for (const [slug, data] of uniqueCompanies) {
    companyMap.set(data.name, companyId); // Map by original company name for lookups
    companyWriter.add([companyId++, data.name, data.slug, data.image]);
  }
  companyWriter.flush();

  // 5. Write Problems and Relations
  console.log(`Processing ${problems.length} problems...`);

  const similarProblemsData = [];
  const relationData = {
    topics: [],
    companies: [],
    mainTopics: [],
    slugs: []
  };

  const seenProblemSlugs = new Set();

  // First pass: Insert all problems and track which ones are inserted
  for (let i = 0; i < problems.length; i++) {
    const p = problems[i];
    const pid = i + 1;

    // Generate unique slug if duplicate
    let uniqueSlug = p.slug;
    if (seenProblemSlugs.has(uniqueSlug)) {
      let counter = 1;
      while (seenProblemSlugs.has(`${uniqueSlug}-${counter}`)) {
        counter++;
      }
      uniqueSlug = `${uniqueSlug}-${counter}`;
      console.log(`  Duplicate slug detected: '${p.slug}' -> '${uniqueSlug}'`);
    }
    seenProblemSlugs.add(uniqueSlug);
    problemMap.set(p.slug, pid);

    // Add Problem with unique slug
    problemWriter.add([
      pid, p.title, uniqueSlug, p.isPremium ?? false, p.dislikes ?? 0, p.likes ?? 0,
      p.difficulty, p.url ?? '', p.accepted ?? 0, p.submissions ?? 0,
      p.acceptanceRate ?? 0, p.platform
    ]);

    // Store relations for later
    p.topicTags.forEach(t => {
      const tid = topicMap.get(t);
      if (tid) relationData.topics.push([pid, tid]);
    });

    p.companyTags.forEach(c => {
      const cid = companyMap.get(c);
      if (cid) relationData.companies.push([pid, cid]);
    });

    p.mainTopics.forEach(t => {
      const mid = mainTopicMap.get(t);
      if (mid) relationData.mainTopics.push([pid, mid]);
    });

    p.topicSlugs.forEach(s => {
      const sid = topicSlugMap.get(s);
      if (sid) relationData.slugs.push([pid, sid]);
    });

    // Store similar for post-processing
    if (p.similarQuestions?.length) {
      p.similarQuestions.forEach(sq => similarProblemsData.push({ pSlug: p.slug, sSlug: sq.slug }));
    }

    if ((i + 1) % 1000 === 0) {
      console.log(`  Processed ${i + 1}/${problems.length} problems...`);
    }
  }

  console.log(`  Total unique problems to insert: ${seenProblemSlugs.size}`);

  // Flush all problems first
  problemWriter.flush();

  // Now add all relations
  console.log('Writing problem relationships...');
  relationData.topics.forEach(r => relProblemTopic.add(r));
  relProblemTopic.flush();

  relationData.companies.forEach(r => relProblemCompany.add(r));
  relProblemCompany.flush();

  relationData.mainTopics.forEach(r => relProblemMainTopic.add(r));
  relProblemMainTopic.flush();

  relationData.slugs.forEach(r => relProblemSlug.add(r));
  relProblemSlug.flush();

  // 6. Write Similar Problems
  console.log('Writing similar problems...');
  let similarId = 1;
  for (const item of similarProblemsData) {
    const pid = problemMap.get(item.pSlug);
    const sid = problemMap.get(item.sSlug);
    if (pid && sid && pid !== sid) {
      similarWriter.add([similarId++, pid, sid]);
    }
  }
  similarWriter.flush();

  // 7. Write Sheets
  console.log('Writing sheets...');
  const sheetsWriter = new SqlBatchWriter(stream, 'Sheets', ['id', 'name', 'slug'], 'ON CONFLICT (slug) DO NOTHING');
  const sheetCatWriter = new SqlBatchWriter(stream, 'SheetCategory', ['id', 'name', 'slug', 'sheetId']);
  const relSheetProbWriter = new SqlBatchWriter(stream, '_SheetCategoryProblems', ['A', 'B']);

  let sheetId = 1;
  let categoryId = 1;

  for (const sheet of sheetsData) {
    sheetMap.set(sheet.slug, sheetId);
    sheetsWriter.add([sheetId, sheet.name, sheet.slug]);

    for (const cat of sheet.categories) {
      sheetCatWriter.add([categoryId, cat.name, cat.slug, sheetId]);

      for (const prob of cat.problems) {
        const pid = problemMap.get(prob.slug);
        if (pid) {
          relSheetProbWriter.add([pid, categoryId]);
        }
      }
      categoryId++;
    }
    sheetId++;
  }

  sheetsWriter.flush();
  sheetCatWriter.flush();
  relSheetProbWriter.flush();

  // 8. Update Sequences
  console.log('Updating sequences...');
  stream.write('-- Reset Sequences\n');
  const sequences = [
    { name: 'ProblemTopic_id_seq', val: topicId },
    { name: 'ProblemMainTopic_id_seq', val: mainTopicId },
    { name: 'ProblemTopicSlug_id_seq', val: topicSlugId },
    { name: 'ProblemCompany_id_seq', val: companyId },
    { name: 'Problem_id_seq', val: problems.length + 1 },
    { name: 'SimilarProblem_id_seq', val: similarId },
    { name: 'Sheets_id_seq', val: sheetId },
    { name: 'SheetCategory_id_seq', val: categoryId },
  ];

  sequences.forEach(seq => {
    stream.write(`SELECT setval('"${seq.name}"', ${seq.val}, true);\n`);
  });

  stream.write('\nCOMMIT;\n');
  stream.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log(`\n✅ Optimized SQL dump generated at: ${outputPath}`);
      console.log(`\nTo import this file into your PostgreSQL database, run:`);
      console.log(`psql -U your_username -d your_database -f seed-data.sql`);
      console.log(`\nOr use the import script:`);
      console.log(`./scripts/import-sql-dump.sh`);
      resolve();
    });
    stream.on('error', reject);
  });
}

// Run
generateSqlDump().catch(e => {
  console.error(e);
  process.exit(1);
});

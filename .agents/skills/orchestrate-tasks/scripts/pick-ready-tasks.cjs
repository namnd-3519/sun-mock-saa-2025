#!/usr/bin/env node
// Picks the next Task Master tasks that can start in parallel.
// Usage: node pick-ready-tasks.cjs [--slots N] [--tasks path/to/tasks.json] [--tag master]
// Prints JSON: { picked, ready, inFlight, blocked, remaining }.
const fs = require('node:fs');
const path = require('node:path');

const BACKEND_PATTERN = /supabase|oauth|data model|migration|\bapi\b|backend|deploy/i;
const PRIORITY_RANK = { high: 3, medium: 2, low: 1 };

function parseArgs(argv) {
  const args = { slots: 3, tasks: '.taskmaster/tasks/tasks.json', tag: 'master' };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    if (!(key in args)) throw new Error(`Unknown flag --${key}`);
    args[key] = key === 'slots' ? Number(argv[i + 1]) : argv[i + 1];
  }
  if (!Number.isInteger(args.slots) || args.slots < 0) throw new Error('--slots must be >= 0');
  return args;
}

function loadTasks(file, tag) {
  const data = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  const tasks = (data[tag] || data).tasks;
  if (!Array.isArray(tasks)) throw new Error(`No tasks array under tag "${tag}"`);
  return tasks;
}

function touchesBackend(task) {
  return BACKEND_PATTERN.test(`${task.title} ${task.description} ${task.details}`);
}

function transitiveDependents(tasks) {
  const children = new Map(tasks.map((t) => [t.id, []]));
  for (const t of tasks) for (const dep of t.dependencies || []) children.get(dep)?.push(t.id);
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const counts = new Map();
  for (const t of tasks) {
    const seen = new Set();
    const stack = [...children.get(t.id)];
    while (stack.length) {
      const id = stack.pop();
      if (seen.has(id) || byId.get(id).status === 'done') continue;
      seen.add(id);
      stack.push(...children.get(id));
    }
    counts.set(t.id, seen.size);
  }
  return counts;
}

function pick({ slots, tasks: file, tag }) {
  const tasks = loadTasks(file, tag);
  const statusOf = new Map(tasks.map((t) => [t.id, t.status]));
  const unblocks = transitiveDependents(tasks);
  const summarize = (t) => ({
    id: t.id,
    title: t.title,
    priority: t.priority,
    unblocks: unblocks.get(t.id),
    backend: touchesBackend(t),
  });

  const inFlight = tasks.filter((t) => t.status === 'in-progress').map(summarize);
  const ready = tasks
    .filter((t) => t.status === 'pending')
    .filter((t) => (t.dependencies || []).every((d) => statusOf.get(d) === 'done'))
    .map(summarize)
    .sort(
      (a, b) =>
        (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0) ||
        b.unblocks - a.unblocks ||
        a.id - b.id,
    );

  const freeSlots = Math.max(0, slots - inFlight.length);
  let backendBusy = inFlight.some((t) => t.backend);
  const picked = [];
  for (const t of ready) {
    if (picked.length >= freeSlots) break;
    if (t.backend && backendBusy) continue;
    if (t.backend) backendBusy = true;
    picked.push(t);
  }

  return {
    picked,
    ready,
    inFlight,
    blocked: tasks.filter((t) => t.status === 'blocked').map(summarize),
    remaining: tasks.filter((t) => !['done', 'cancelled'].includes(t.status)).length,
  };
}

try {
  process.stdout.write(`${JSON.stringify(pick(parseArgs(process.argv.slice(2))), null, 2)}\n`);
} catch (error) {
  process.stderr.write(`pick-ready-tasks: ${error.message}\n`);
  process.exit(1);
}

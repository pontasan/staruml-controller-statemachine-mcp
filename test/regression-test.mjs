#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('statemachine', DIR, async (ctx) => {
  let s = ctx.step('Create statechart diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/statemachine/diagrams', { name: 'Test StateMachine' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create initial pseudostate');
  let initId;
  try {
    const res = await apiPost('/api/statemachine/pseudostates', { diagramId, pseudostateKind: 'initial', x1: 100, y1: 50, x2: 130, y2: 80 });
    initId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create state (Idle)');
  let idleId;
  try {
    const res = await apiPost('/api/statemachine/states', { diagramId, name: 'Idle', x1: 50, y1: 130, x2: 180, y2: 190 });
    idleId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create state (Running)');
  let runId;
  try {
    const res = await apiPost('/api/statemachine/states', { diagramId, name: 'Running', x1: 280, y1: 130, x2: 410, y2: 190 });
    runId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create final state');
  let finalId;
  try {
    const res = await apiPost('/api/statemachine/final-states', { diagramId, x1: 330, y1: 280, x2: 360, y2: 310 });
    finalId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create transition: Initial → Idle');
  try {
    await apiPost('/api/statemachine/transitions', { diagramId, sourceId: initId, targetId: idleId });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create transition: Idle → Running');
  try {
    await apiPost('/api/statemachine/transitions', { diagramId, sourceId: idleId, targetId: runId, name: 'start', guard: 'isReady' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create transition: Running → Final');
  try {
    await apiPost('/api/statemachine/transitions', { diagramId, sourceId: runId, targetId: finalId, name: 'complete' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export statemachine image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/statemachine/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});

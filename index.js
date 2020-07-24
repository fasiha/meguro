#!/usr/bin/env node
'use strict';
var fs = require('fs');
var ebisu = require('ebisu-js');
var readlineSync = require('readline-sync');
var kana = require('./kana');

var filename = process.argv[2] || 'README.md';

/**
 * @param {string} s
 * @param {number} now
 */
function elapsed(s, now) { return (now - (new Date(s)).valueOf()) / 3600e3; }
var DEFAULT_MODEL = [2, 2, 1];

var notdone = true;
while (notdone) {
  const now = Date.now();
  let best = {card: undefined, lino: undefined, pRecall: Infinity};

  const lines = fs.readFileSync(filename, 'utf8').split('\n');
  for (const [lino, line] of lines.entries()) {
    if (!(/[^@]+@@/.test(line))) { continue; }
    const data = line.split('@@', 2)[1];
    if (data.trim() === '') {
      best = {card: {model: DEFAULT_MODEL}, lino, pRecall: -Infinity};
      break;
    }
    /** @type{{model:Array<number>, time?: string}} */
    let card;
    try {
      card = JSON.parse(data);
    } catch (err) {
      console.error({err, data, line, lino});
      process.exit(1);
    }
    const pRecall = ebisu.predictRecall(card.model, elapsed(card.time, now));
    if (pRecall < best.pRecall) {
      best = {card, lino, pRecall};
    }
  }

  if (!best.card) {
    console.log('Learn something.');
    process.exit(0);
  }

  const [quizRelevant, ...extra] = lines[best.lino].split('@@', 1)[0].split(/(\()/);
  const [prompt, ...expecteds] = quizRelevant.trim().split(/\s+/);
  if (expecteds.length === 0) { console.log('Enter→you remember the card. Any other text→you forgot it.') }
  const response = readlineSync.question(`${prompt} :: `).trim();
  if (!response && expecteds.length > 0) {
    console.log('Quitting');
    process.exit(0);
  }
  const result = expecteds.length === 0
                     ? !response
                     : prompt === response || expecteds.map(kana.kata2hira).includes(kana.kata2hira(response));

  console.log(`${
      result ? '💇‍♀️⚡️🎊🍌'
             : `🙅‍♂️👎❌🚷${expecteds.length ? `, expected: ${expecteds}` : ''}`}. ${extra.join('')}`);
  const scale = readlineSync.question(
      `Type a number to scale this card's easiness, Enter to see next question, or anything else to quit > `);

  const newNow = new Date();
  /** @type{{model:Array<number>, time?: string}} */
  const newCard = {
    model: best.card.time ? ebisu.updateRecall(best.card.model, +result, 1, elapsed(best.card.time, newNow.valueOf()))
                          : best.card.model,
    time: newNow.toISOString()
  };

  if (scale) {
    if (isNaN(scale = parseFloat(scale))) {
      notdone = false;
    } else {
      const hl = ebisu.modelToPercentileDecay(newCard.model);
      const scaledModel = ebisu.updateRecall(newCard.model, 1, 1, .001, false, hl);
      scaledModel[2] = hl * scale;
      newCard.model = scaledModel;
    }
  }

  lines[best.lino] = lines[best.lino].split('@@')[0] + `@@ ${JSON.stringify(newCard)}`;
  fs.writeFileSync(filename, lines.join('\n'));
}
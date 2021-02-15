#!/usr/bin/env node
'use strict';
var fs = require('fs');
var chalk = require('chalk');
var ebisu = require('ebisu-js');
var readlineSync = require('readline-sync');
var commandLineArgs = require('command-line-args');
var kana = require('./kana');

var optionDefinitions = [
  {name: 'input', type: String, defaultOption: true},
  {name: 'separator', alias: 's', type: String},
  {name: 'help', description: 'Print this usage guide.', type: Boolean},
];
var options = commandLineArgs(optionDefinitions)

var filename = options.input;
var separator = options.separator || /\s+/;

if (!fs.existsSync(filename) || options.help) {
  const commandLineUsage = require('command-line-usage');
  const sections = [
    {header: 'Meguro', content: '{italic Very} simple flashcards. https://github.com/fasiha/meguro'}, {
      header: 'Options',
      optionList: [
        {
          name: optionDefinitions[0].name,
          defaultOption: true,
          typeLabel: '{underline file}',
          description: 'File containing Meguro flashcards'
        },
        {
          name: optionDefinitions[1].name,
          alias: optionDefinitions[1].alias,
          typeLabel: '{underline separator}',
          description: 'OPTIONAL: text separating question and answer(s)'
        },
        {name: 'help', description: 'Print this usage guide.', type: Boolean},
      ]
    }
  ];
  const usage = commandLineUsage(sections);
  if (!options.help && filename && !fs.existsSync(filename)) { console.log('ERROR: file not found'); }
  console.log(usage);
  process.exit(1);
}

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

  const fullfile = fs.readFileSync(filename, 'utf8');
  const lines = fullfile.split('\n');
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
  const [prompt, ...expecteds] = quizRelevant.trim().split(separator).map(s => s.trim());
  const expectedsString = expecteds.map(s => chalk.bold(s)).join(' or ');
  if (expecteds.length === 0) { console.log('Enter→you remember the card. Any other text→you forgot it.') }
  const response = readlineSync.question(`${chalk.bold(prompt)} :: `).trim();
  const result = expecteds.length === 0 ? !response
                 : response === ''
                     ? !readlineSync
                            .question(`Expected answers: ${expectedsString}.
Enter→you remembered, any other text→you forgot. `)
                            .trim()
                     : prompt === response || expecteds.map(kana.kata2hira).includes(kana.kata2hira(response));

  console.log(`${
      result ? '💇‍♀️⚡️🎊🍌'
             : `🙅‍♂️👎❌🚷${expecteds.length ? `, expected: ${expectedsString}` : ''}`}. ${
      chalk.underline(extra.join(''))}`);
  let scale = readlineSync.question(
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
      // we've already told the user above that "anything else" will quit so don't warn them again
    } else {
      const hl = ebisu.modelToPercentileDecay(newCard.model);
      const scaledModel = ebisu.updateRecall(newCard.model, 1, 1, .001, false, hl);
      scaledModel[2] = hl * scale;
      newCard.model = scaledModel;
    }
  }

  // REREAD the file and make sure its contents haven't changed (this is more reliable than, and easier than, checking
  // modified timestamp). Of course this might wind up being grossly inefficient.
  if (fullfile === fs.readFileSync(filename, 'utf8')) {
    lines[best.lino] = lines[best.lino].split('@@')[0] + `@@ ${JSON.stringify(newCard)}`;
    fs.writeFileSync(filename, lines.join('\n'));
  } else {
    console.log(chalk.red.bgWhite.bold(
        'Your file changed during quiz. To avoid losing changes, your results will NOT be written.'));
    process.exit(1);
  }
  // Newline to space out cards
  console.log('');
}
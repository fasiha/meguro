# meguro

Command-line app for very, very simple flashcards.

Any line that has
1. a word (the prompt, i.e., the question),
2. another word (the expected answer),
3. optionally anything else,
4. and two at symbols, i.e.,
```
@@
```
is treated as a flashcard. Stuff after the double-@ is Meguro-specific stuff. For example:

☀️ sun "Oh Mr Sun, Sun, Mr Golden Sun" @@

The ☀️ emoji and "sun" comprise the flashcard. The "Oh Mr Sun, Sun, Mr Golden Sun" is extra information that'll be shown after you answer this flashcard.

## Installation and launching
Meguro requires [Node.js](https://nodejs.org)—either LTS or current version is fine.

The *easy* way to run Meguro, if you don't plan on developing it, is 
1. to write a file containing some flashcards as described above (or downloading [this very README.md](https://raw.githubusercontent.com/fasiha/meguro/master/README.md) that you're reading!), then 
2. in your terminal (Terminal app, Command Prompt, xterm, etc.) run
```console
npx meguro README.MD
```
(You may first need to use `cd` to enter the directory you saved the file, or change `README.md` above to whatever your filename might be.)

Alternatively, if you plan on developing Meguro, install [Git](https://git-scm.com) and [Node.js](https://nodejs.org), then run the following in your terminal:
```shell
git clone https://github.com/fasiha/meguro
cd meguro
npm i
```
This downloads this repository to your device, enters the new directory, and installs a couple of Node modules via `npm` (which was installed by Node).

Then you can launch Meguro on README.me (this file!) by
```shell
node index.js README.md
```

## Usage
If you run Meguro on this README.md that you're reading, it will quiz you on the "sun" flashcard above. Type an answer, or just press Enter to quit.

Meguro will then tell you whether you answered correctly or not. If not, it will tell you the answer it was expecting. In either case, it'll also tell you any extra information accompanying the card.

Then it will offer to let you scale the quiz's easiness or difficulty. Meguro uses [Ebisu](https://fasiha.github.io/ebisu) under the hood for nice Bayesian spaced-repetition scheduling, so you can totally just let it do its thing by just pressing Enter here. But, if you want Meguro to show you this flashcard less often because you really know it well, you can give it a number like 2 or 5 or something greater than 1 to *increase* the time between reviews by that amount.

> Similarly, if you're unhappy with how long Meguro went without showing you a flashcard, you can use 0.8 or 0.5 or any number less than 1 to *decrease* the time between reviews by that amount.
> 
> Nota bene, Meguro starts you out with memory halflife of one hour.

As mentioned, if you don't need to scale the card's easiness, just hit Enter. In either case, Meguro will update the file, and then find the question that you're most likely to forget, forever, until you quit—you can hit Control-C at any time to do so.

Here are another couple of flashcards so you can see how it works:

🚢 boat @@

🎹 piano @@

Out of the box, Meguro will convert between hiragana and katakana as needed.

And if you look at the file, you'll see Meguro puts JSON after the double-slashes, for example—
```json
{"model":[2.9659860739369863,2.964396981142354,2.04306830368043],"time":"2020-06-13T04:29:19.684Z"}
```

[Get in touch.](https://fasiha.github.io/#contact)

## Changelog
- **2.0** uses double-at as separators, and supports extra information.
- **1.0** development version
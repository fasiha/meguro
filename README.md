# meguro

Command-line app for very, very simple flashcards.

Any line that has
1. a word (the prompt, i.e., the question),
2. another word (the expected answer),
3. and two slashes, i.e.,
```
//
```
is treated as a flashcard.

Stuff after the double-slash is Meguro-specific stuff. For example:

☀️ sun //

## Installation
Install [Git](https://git-scm.com) and [Node.js](https://nodejs.org) (either LTS or current version is fine!), then in your terminal (something like Terminal.app, Command Prompt, xterm, etc.), run the following:
```shell
git clone https://github.com/fasiha/meguro
cd meguro
npm i
```
This downloads this repository to your device, enters the new directory, and installs a couple of Node modules via `npm` (which was installed by Node).

## Usage
```shell
node index.js README.md
```
Meguro will read README.md (this file) and will quiz you on the "sun" flashcard above. Type an answer, or just press Enter to quit.

Meguro will then tell you whether you answered correctly or not. If not, it will tell you the answer it was expecting.

Then it will offer to let you scale the quiz's easiness or difficulty. Meguro uses [Ebisu](https://fasiha.github.io/ebisu) under the hood for nice Bayesian spaced-repetition scheduling, so you can totally just let it do its thing by just pressing Enter here. But, if you want Meguro to show you this flashcard less often because you really know it well, you can give it a number like 2 or 5 or something greater than 1 to *increase* the time between reviews by that amount.

> Similarly, if you're unhappy with how long Meguro went without showing you a flashcard, you can use 0.8 or 0.5 or any number less than 1 to *decrease* the time between reviews by that amount.
> 
> Nota bene, Meguro starts you out with memory halflife of one hour.

As mentioned, if you don't need to scale the card's easiness, just hit Enter. In either case, Meguro will update the file, and then find the question that you're most likely to forget, forever, until you quit—you can hit Control-C at any time to do so.

Here are another couple of flashcards so you can see how it works:

🚢 boat //

🎹 piano //

Out of the box, Meguro will convert between hiragana and katakana as needed.

And if you look at the file, you'll see Meguro puts JSON after the double-slashes, for example—
```json
{"model":[2.9659860739369863,2.964396981142354,2.04306830368043],"time":"2020-06-13T04:29:19.684Z"}
```

[Get in touch.](https://fasiha.github.io/#contact)
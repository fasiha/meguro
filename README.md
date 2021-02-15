# meguro

Command-line app for very, very simple flashcards.

Meguro looks for flashcards inside a plain text file. Any line that has
1. a word or phrase (the prompt, i.e., the question), followed by a separator (default: a space), followed by
2. (optionally, one or more words/phrases separated by the same separator (default: a space): these are all the acceptable answers),
3. (optionally, any text in parenthesis, i.e., `()`, which is shown *after* a quiz),
4. and **required** two *at*-symbols, i.e.,
```
@@
```
is treated as a flashcard. Stuff after the double-@ will be Meguro-specific stuff.

Example 1:

☀️ sun soleil たいよう ("Oh Mr Sun, Sun, Mr Golden Sun") @@

This flashcard has all three elements in it: the ☀️ emoji is the prompt, acceptable answers are "sun", "soleil", and "たいよう" (or タイヨウ because Meguro automatically converts between hiragana and katakana as needed), and finally, "Oh Mr Sun, Sun, Mr Golden Sun" is extra information that'll be shown after you answer this flashcard.

Example 2, in contrast, is a very minimal flashcard:

👒 @@

The only "answer" required for this flashcard is whether you remember the sun-hat emoji or not.

Meguro smoothly handles both
- automatic grading, where Meguro checks whether what you typed was one of the expected answers, as well as
- manual grading, where Meguro shows you all expected answers and asks you to score your recall.

In either case, the quiz is boolean (yes/no). It has no concept of difficulty.

## Installation and use
Meguro requires [Node.js](https://nodejs.org) (any version is ok).

The *easy* way to run Meguro, if you don't plan on developing it, is 
1. to write a file containing some flashcards as described above (or downloading [this very README.md](https://raw.githubusercontent.com/fasiha/meguro/master/README.md) that you're reading!), then 
2. in your terminal (Terminal app, Command Prompt, xterm, etc.) run
```console
npx meguro README.md
```
(You may first need to use `cd` to enter the directory you saved the file, or change `README.md` above to whatever your filename might be.)

### Custom separator
Use the `-s` or `--separator` command-line flag to tell Meguro what separator you used between your prompts and acceptable answers. For example, suppose you have a file where you use "💖💗" to separate these, e.g.,

☀️ 💖💗 sun 💖💗 soleil 💖💗 たいよう ("Oh Mr Sun, Sun, Mr Golden Sun") @@

To tell Meguro about your custom separator, run it like this:
```console
npx meguro README.md -s 💖💗
```
*or*
```console
npx meguro README.md --separator 💖💗
```

> N.B. Recall that by default, the separator is whitespace, which is useful for vocabulary (especially in languages that don't have spaces), but is limiting otherwise.
>
> N.B.2. Depending on your terminal application or shell, you might have to wrap your separator in double- or single-quotes, e.g., `npx meguro README.md -s '💖💗'`. I have *not* tested this extensively, please open [an issue](https://github.com/fasiha/meguro/issues) and we'll try to help you.

## Development
Alternatively, if you plan on *developing* Meguro, install [Git](https://git-scm.com) as well as [Node.js](https://nodejs.org), then run the following in your terminal:
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
(The `-s`/`--separator` flag is also of course available here.)

## Detailed usage
If you run Meguro on this README.md that you're reading, it will quiz you on the "sun" flashcard above. You may
1. type an answer, which Meguro will grade and give immediate feedback on, or
2. press Enter, in which case Meguro will show you what answer(s) it expected and invite you to grade yourself by either
    - pressing Enter again to indicate you remembered this flashcard, or
    - typing anything else and then Enter to indicate you forgot it.

In all cases, Meguro will give you feedback on the answers it was expecting and any extra information accompanying the card.

Then it will offer to let you scale the quiz's easiness or difficulty. Meguro uses [Ebisu](https://fasiha.github.io/ebisu) under the hood for nice Bayesian spaced-repetition scheduling, so you can totally just let it do its thing by just pressing Enter here. But, if you want Meguro to show you this flashcard less often because you really know it well, you can give it a number like 2 or 5 or something greater than 1 to *increase* the time between reviews by that amount.

> Similarly, if you're unhappy with how long Meguro went without showing you a flashcard, you can use 0.8 or 0.5 or any number less than 1 to *decrease* the time between reviews by that amount.
> 
> Nota bene, Meguro starts you out with memory halflife of one hour.

As mentioned, if you don't need to scale the card's easiness, just hit Enter. In either case, Meguro will update the file, and then find the next question that you haven't learned or that you're most likely to forget, forever, until you quit—you can hit Control-C at any time to do so.

In the case of this [README](https://raw.githubusercontent.com/fasiha/meguro/master/README.md) file, it will then ask you about 👒. Because no answers are required, you can just press Enter to indicate that you remember this flashcard, or any other text to indicate you don't. The rest is the same as above.

Here are another couple of flashcards so you can see how it works:

🚢 boat bateau ふね (🌊🌊🌊) @@

🎹 piano ピアノ @@

Out of the box, Meguro will convert between hiragana and katakana as needed.

And if you look at the file, you'll see Meguro puts JSON after the double-slashes, for example—
```json
{"model":[2.9659860739369863,2.964396981142354,2.04306830368043],"time":"2020-06-13T04:29:19.684Z"}
```

[Get in touch.](https://fasiha.github.io/#contact)

## Changelog
- **3.3** allow self-grading; bugfix in scale; don't overwrite a changed file; add color
- **3.2** allow custom separators (see issue #2)
- **3.1** allow flashcards to have no answers. These are self-graded pure-recall quizzes.
- **3.0** multiple acceptable answers, separated from extra info by parenthesis.
- **2.0** uses double-at as separators, and supports extra information.
- **1.0** development version
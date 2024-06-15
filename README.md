# gsays

```markdown
# gsays : use google translate for translation and text-to-speech from cli

## Overview

gsays allows for fetching translations and generating text-to-speech using Google Translate. With a simple command-line tool (CLI) and programmatic usage, gsays can be used to translate text between languages and generate audio files for the translated text.

## Installation

```bash
npm install gsays
# or for global installation
npm install -g gsays
```

## Usage

### CLI

gsays can be used via the command line interface (CLI). It takes three mandatory arguments that can be passed in any order, just make sure when parsing languages to first set the source then the target. when passing `a` or `audio`, an an output.mp3 file will be saved in the current dir and as for the text to be translated, if a file is found with the text you passed, then gsays will attempt to read the file and if it can not it will take it as a text string, like that the text can either be input directly, preferably in between "" or read from a file.

```bash
gsays <sourceLang> <targetLang> <text - targetFile> <a - audio>
```

Program can also be ran with npx or bunx

```bash

    npx gsays <sourceLang> <targetLang> <text - targetFile> <a - audio>

```

Each one of the translations text responses is time stamped and saved in a json in `.gsays_hist.json` in the $HOME directory.

### Programmatic Usage

You can also use gsays programmatically by importing it into your JavaScript project. the two main functions are `fetchAudio` and `fetchTranslation` which are used to fetch audio and translation respectively, and the main function `gsays` which is a wrapper for the two functions.

```javascript
import gsays from 'gsays';

audio = await gsays.fetchAudio('en', 'fr', 'Hello, world!');
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
// Output is text and mp3 file


translation = await gsays.fetchTranslation('en', 'fr', 'Hello, world!');
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
// Output is translated text

```

## API

### Fetching Audio

```javascript
const fetchAudio = async (language, message, slowMode = false) => {
    // Implementation...
};
```

### Fetching Translation

```javascript
const fetchTranslation = async (fromLang, toLang, text) => {
    // Implementation...
};
```

### Main Function

```javascript
const gsays = async (sourceLang, targetLang, text) => {
    // Implementation...
};
```

## Directory Structure

```bash
.
├── src
│   ├── main.js
│   ├── utils
│   │   ├── api.js
│   │   ├── languages.js
│   └── data
│       └── languages.json
├── index.js
└── bin
    └── cli.js
```

## Contributing

Contributions are welcome. Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License

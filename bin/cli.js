#!/usr/bin/env -S node --no-warnings

import gsays from '../index.js';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import writeLogs from '../src/utils/writeLogs.js';
import languages from '../src/data/languages.json' assert { type: "json" };


const args = process.argv.slice(2);
let sourceLang = '';
let targetLang = '';
let text = '';
let endpoint = 'text';

let langOptions = languages.languages;
// First args that is equal to any languages is set as sourceLang the second that matches is set as targetLang if an arg == audio we set it to endpoint any other arg is set to text
args.forEach((arg) => {
  if (langOptions[arg] && !sourceLang) {
    sourceLang = arg;
  } else if (langOptions[arg] && !targetLang) {
    targetLang = arg;
  } else if (arg === 'audio') {
    endpoint = 'audio';
  } else {
    text = arg;
  }
});



// const { sourceLang, targetLang, text, endpoint } = argv;

(async () => {
 
  try {
    const filePath = path.resolve(text);
    // check if filePath is a file
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      // ignore and leave text as is if it's not a file
        return; 
    } else {
    text = await fs.readFile(filePath, 'utf-8');
    }
}
  // if there are no files to read, the text is left as is no error message to be displayed
    catch (error) {
        // console.error(`Error: ${error.message}`);
    }

  try {
    const result = await gsays(sourceLang, targetLang, text, endpoint);
    await writeLogs(sourceLang, targetLang, text, result);
    if (result.audio) {
        // if file exist, dont overwrite instead crete output1 2 and so on
        let i = 0;
        let output = path.join(process.cwd(), 'output.mp3');
        while (await fs.access(output).then(() => true).catch(() => false)) {
            output = path.join(process.cwd(), `output${++i}.mp3`);
        }
        await fs.writeFile(output, result.audio);
        console.log(`Audio file saved as ${output}`);
    } 

    } catch (error) {
        console.error(`Error: ${error.message}`);
    }

})();





// gsays(sourceLang, targetLang, text, endpoint).catch(console.error);
const langOrigin = chalk.cyanBright(sourceLang);
const langDest = chalk.cyanBright(targetLang);
const link = chalk.greenBright('with https://github.com/zshmeta/gsays');
console.log(chalk.redBright(`\nTranslated from ${langOrigin} to ${langDest} ${link}\n`));

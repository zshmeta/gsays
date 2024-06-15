import { load } from "cheerio";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { apiCall, Endpoints } from './utils/api.js';
import { validLangCode, fixLangCode, setGoogleLang } from './utils/languages.js' 


const fetchAudio = async (language, message, slowMode = false) => {
    try {
        const convertedLang = setGoogleLang(language);
        const cutoffPoint = message.lastIndexOf(" ", 200);
        const truncatedMessage = message.slice(0, message.length > 200 && cutoffPoint !== -1 ? cutoffPoint : 200);
        const encodedMessage = encodeURIComponent(truncatedMessage);
        const messageLength = truncatedMessage.length;
        const playbackSpeed = slowMode ? 0.1 : 1;
        const response = await apiCall(Endpoints.AUDIO)
            .with({ lang: convertedLang, text: encodedMessage, textLength: messageLength, speed: playbackSpeed })
            .doing(({ data }) => data ? Array.from(new Uint8Array(data)) : null);
        return response;
    } catch (error) {
        console.error('Error fetching audio:', error);
        return null;
    }
};


const fetchText = async (fromLang, toLang, text) => {

        const convertedSourceLang = setGoogleLang(fromLang);
        const convertedTargetLang = setGoogleLang(toLang);
        const encodedText = encodeURIComponent(text);

        // Return null if the query exceeds 7500 characters
        if (encodedText.length > 7500) {
            console.error('Error: The text to translate is too long.');
            return null;
        }

        return apiCall(Endpoints.TEXT)
            .with({ source: convertedSourceLang, target: convertedTargetLang, query: encodedText })
            .doing(({ data }) => {
                if (!data) {
                    console.error('Error fetching translation data.');
                    return null;
                }
                // Load the HTML response and extract the translation text
                const translation = load(data)(".result-container").text()?.trim();
                if (translation && !translation.includes("#af-error-page")) {
                    console.log('\n');
                    console.log(chalk.yellowBright(text));
                    console.log(chalk.cyanBright(translation));
                    console.log('\n');
                    return translation;
                } else {
                    console.error(chalk.red('Error: Failed to extract translation'));
                    return null;
                }
            });
    };



const gsays = async (sourceLang, targetLang, text, endpoint = 't') => {

        let validSourceLang = sourceLang;
        if (!validLangCode(sourceLang)) {
            console.log(chalk.red(`Invalid source language code: ${sourceLang}. Using auto-detection instead.`));
            validSourceLang = fixLangCode('source', sourceLang);
        }
    
        let validTargetLang = targetLang;
        if (!validLangCode(targetLang)) {
            console.log(`Invalid target language code: ${targetLang}. Using English as default.`);
            validTargetLang = 'en';
        }


    
        const translation = await fetchText(validSourceLang, validTargetLang, text);
    
        if (endpoint === 'a' || endpoint === 'audio') {
            const audio = await fetchAudio(validTargetLang, translation);
            return { translation, audio };
        }
    
        return translation;
    };    

    gsays.fetchAudio = fetchAudio;
    gsays.fetchText = fetchText;

    export default gsays;
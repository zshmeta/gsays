import languages from "../data/languages.json" assert { type: "json" };

const LangType = {
    SOURCE: "origin",
    TARGET: "destination"
};

// Function to check if the key is a property of the object
const checkLangCode = (obj) => (key) => key in obj;

// Checking wether the language code is valid
const validLangCode = (code, category = "all") => 
    !!code && checkLangCode(allLanguages[category])(code);

// if invalid, replace with the correct language code
const fixLangCode = (category, code) => {
    const exceptions = languages.exceptions[category];
    return exceptions[code] || code;
};

// Convert the language code to the Google Translate API format
const setGoogleLang = (code) => {
    const mappings = languages.mappings["request"];
    return mappings[code] || code;
};


const setLangType = (category) => {
    const entries = Object.entries(languages.languages);
    const exceptions = languages.exceptions[category];
    
};

const allLanguages = {
    all: languages.languages,
    origin: setLangType(LangType.SOURCE),
    destination: setLangType(LangType.TARGET)
};

export {
    LangType,
    setLangType,
    validLangCode,
    fixLangCode,
    setGoogleLang,
    allLanguages
};

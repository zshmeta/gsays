import axios from "axios";
import UserAgent from "user-agents";

// Define API endpoints
const Endpoints = {
    TEXT: "text",
    AUDIO: "audio"
};

// Function to make a request to an endpoint with retry logic
const apiCall = (endpoint, retry = 0) => ({
    with: (params) => {
        // Fetch data based on endpoint and parameters
        const promise = fetchData(endpoint, params);
        return {
            promise,
            doing: (callback) => (
                promise.then(callback)
                    .catch(() => undefined) // Ignore errors
                    .then(result => 
                        // Retry up to 3 times if the result is empty
                        isResultEmpty(result) && retry < 3
                            ? apiCall(endpoint, retry + 1).with(params).doing(callback)
                            : result ?? null // Return result or null
                    )
            )
        }
    }
});

// Function to check if the result is empty
const isResultEmpty = (item) => (
    !item || (typeof item === "object" && "length" in item && item.length <= 0)
);

// Function to fetch data from the appropriate endpoint
const fetchData = (endpoint, params) => {

    // Handle TEXT endpoint
    if (endpoint === Endpoints.TEXT) {
        const { source, target, query } = params;
        return axios.get(
            `https://translate.google.com/m?sl=${source}&tl=${target}&q=${query}`,
            {
                headers: {
                    "User-Agent": new UserAgent().toString()
                }
            }
        );
    }

    // Handle AUDIO endpoint
    if (endpoint === Endpoints.AUDIO) {
        const { lang, text, textLength, speed } = params;
        return axios.get(
            `https://translate.google.com/translate_tts?tl=${lang}&q=${text}&textlen=${textLength}&speed=${speed}&client=tw-ob`,
            {
                responseType: "arraybuffer",
                headers: {
                    "User-Agent": new UserAgent().toString()
                }
            }
        );
    }

    // Throw an error for invalid endpoints
    throw new Error("Invalid endpoint");
};

export {
    Endpoints,
    apiCall
};
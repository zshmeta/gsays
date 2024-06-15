import fs from 'fs/promises';
import path from 'path';




const writeLogs = async (sourceLang, targetLang, text, translation) => {
    const log = {
        sourceLang,
        targetLang,
        text,
        translation,
        date: new Date().toLocaleString()
    };

    const logPath = path.join(process.env.HOME, '.gsays_hist.json');
    try {
        const logs = JSON.parse(await fs.readFile(logPath, 'utf-8'));
        logs.push(log);
        await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(logPath, JSON.stringify([log], null, 2));
        } else {
            console.error('Error writing logs:', error);
        }
    }
}


export default writeLogs;

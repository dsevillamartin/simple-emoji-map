/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Flarum
 * Copyright (c) 2018 ReFlar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const fs = require('fs');
const path = require('path');
const twemoji = require('@twemoji/api');
const getConfig = require('./src/config');

const outputPath = path.resolve(__dirname, 'generated/emojis.json');
const skinsOutputPath = path.resolve(__dirname, 'generated/variants.json');

const alternative = {
    '👁️‍🗨️': '👁‍🗨',
};
const TYPES = {
    EMOJI: 0,
    CODEPOINT: 1,
};

const getShortcodes = (
    { dataset, lang, fallbackDataset, fallbackLang },
    defLang
) => {
    let shortcodeData, fallbackShortcodeData;

    if (!lang) lang = defLang;
    if (!fallbackLang) fallbackLang = defLang;

    try {
        shortcodeData = require(`emojibase-data/${lang}/shortcodes/${dataset}.json`);
        fallbackShortcodeData =
            fallbackDataset &&
            require(`emojibase-data/${fallbackLang}/shortcodes/${fallbackDataset}.json`);
    } catch (err) {
        console.error(
            `-> Failed to load shortcode data using '${dataset}' (${lang}) with '${fallbackDataset}' (${fallbackLang}) as a fallback`
        );
        throw err;
    }

    if (!fallbackShortcodeData) {
        return shortcodeData;
    }

    const fallback = [];

    for (const key in fallbackShortcodeData) {
        if (!shortcodeData[key]) {
            fallback.push(key);
            shortcodeData[key] = fallbackShortcodeData[key];
        }
    }

    if (fallback.length) {
        console.warn(
            `-> ${
                fallback.length
            } shortcodes not found in '${dataset}' (${lang}), fall back to 'emojibase' list:\n${fallback
                .map(twemoji.convert.fromCodePoint)
                .join(', ')}`
        );
    }

    return shortcodeData;
};

const ensureArray = (data) => {
    return Array.isArray(data) ? data : [data];
};

module.exports = async () => {
    // general options
    const config = await getConfig();
    const type = TYPES[config.type.toUpperCase()] || TYPES.EMOJI;
    const shortnames = config.shortnames;
    const regex = config.regex && new RegExp(config.regex);

    const emojis = {};
    const skinEmojis = {};
    const used = [];
    const usedSkins = [];
    const ignored = [];
    const ignoredSkins = [];

    // shortcodes
    const shortcodeConfig = config.shortcodes;

    const shortcodeData = getShortcodes(shortcodeConfig, config.lang);
    const data = require(`emojibase-data/${config.lang}/data.json`);

    for (let e of data) {
        const emoji = alternative[e.emoji] || e.emoji;
        const emojiCode = e.hexcode;

        const shortcodes = ensureArray(shortcodeData[emojiCode.toUpperCase()]);

        if (regex && shortcodes.find((e) => !regex.test(e))) {
            ignored.push(emoji);
            continue;
        }

        if (!shortcodes.length) {
            console.warn(
                `-> Could not find shortcodes for ${emoji} (${emojiCode})`
            );
        }

        if (e.skins) {
            for (let skin of e.skins) {
                const emoji = skin.emoji;
                const emojiCode = skin.hexcode;

                const shortcodes = ensureArray(
                    shortcodeData[emojiCode.toUpperCase()]
                );

                if (regex && shortcodes.find((e) => !regex.test(e))) {
                    ignoredSkins.push(emoji);
                    continue;
                }

                const key = type === TYPES.EMOJI ? emoji : emojiCode;
                skinEmojis[key] = shortcodes.concat(
                    shortnames[emojiCode] || []
                );
                usedSkins.push(skinEmojis);
            }
        }

        const key = type === TYPES.EMOJI ? emoji : emojiCode;

        emojis[key] = shortcodes.concat(shortnames[emojiCode] || []);

        used.push(emoji);
    }

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(emojis));

    fs.writeFileSync(skinsOutputPath, JSON.stringify(skinEmojis));

    return { ignored, used };
};

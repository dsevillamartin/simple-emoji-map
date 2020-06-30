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
const twemoji = require('twemoji');
const getConfig = require('./src/config');

const outputPath = path.resolve(__dirname, 'generated/emojis.json');
const skinsOutputPath = path.resolve(__dirname, 'generated/variants.json');
const data = require('emojibase-data/en/data.json');

const alternative = {
    '👁️‍🗨️': '👁‍🗨',
};
const TYPES = {
    EMOJI: 0,
    CODEPOINT: 1,
};

module.exports = async () => {
    const config = await getConfig();
    const type = TYPES[config.type.toUpperCase()] || TYPES.EMOJI;
    const shortnames = config.shortnames;

    const emojis = {};
    const skinEmojis = {};
    const used = [];
    const usedSkins = [];
    const ignored = [];
    const ignoredSkins = [];

    for (let e of data) {
        const emoji = alternative[e.emoji] || e.emoji;  
        const emojiCode = getEmojiIconCode(emoji);

        if (
            config.regex &&
            e.shortcodes.filter((e) => !config.regex.test(e)).length ===
                e.shortcodes.length
        ) {
            ignored.push(emoji);
            continue;
        }

        if (e.skins) {
            for (let skin of e.skins) {
                const emoji = skin.emoji;
                const emojiCode = getEmojiIconCode(emoji);

                if (
                    config.regex &&
                    skin.shortcodes.filter((e) => !config.regex.test(e))
                        .length === skin.shortcodes.length
                ) {
                    ignoredSkins.push(emoji);
                    continue;
                }

                const key = type === TYPES.EMOJI ? emoji : emojiCode;
                skinEmojis[key] = skin.shortcodes.concat(
                    shortnames[emojiCode] || []
                );
                usedSkins.push(skinEmojis);
            }
        }

        const key = type === TYPES.EMOJI ? emoji : emojiCode;

        emojis[key] = e.shortcodes.concat(shortnames[emojiCode] || []);

        used.push(emoji);
    }

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(emojis));

    fs.writeFileSync(skinsOutputPath, JSON.stringify(skinEmojis));

    return { ignored, used };

    function getEmojiIconCode(emoji) {
        const U200D = String.fromCharCode(0x200d);
        return twemoji.convert.toCodePoint(
            emoji.indexOf(U200D) < 0 ? emoji.replace(/\uFE0F/g, '') : emoji
        );
    }
};

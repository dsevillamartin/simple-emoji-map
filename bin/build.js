#!/usr/bin/env node

const chalk = require('chalk');
const build = require('../build');

// Verify emojibase-data is installed
const getEmojibaseVersion = () => {
    try {
        const pkg = require('emojibase-data/package.json');
        return pkg.version;
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error(
                chalk.red.bold(
                    'Error: emojibase-data is not installed. Please install it as a peer dependency.'
                )
            );
            process.exit(1);
        }

        throw err;
    }
};

const emojiDataVersion = getEmojibaseVersion();

console.log(chalk.cyan.bold('Generating simple emoji map...'));
console.log(chalk.cyan(`-> emojibase-data: ${emojiDataVersion}`));

build()
    .then(({ ignored, used }) => {
        if (ignored.length) {
            console.warn(
                chalk.cyan(`-> Used (${used.length}):`),
                ...used.slice(0, 10)
            );
            console.warn(
                chalk.cyan(`-> Ignored (${ignored.length}):`),
                ...ignored.slice(0, 10)
            );
        }

        console.log(chalk.cyan.bold('Success 👍'));
    })
    .catch((err) => {
        console.error(err);
        console.error(chalk.red.bold('Failed to generate emoji map.'));
    });

#!/usr/bin/env node

const chalk = require('chalk');
const build = require('../build');

console.log(chalk.cyan.bold('Generating simple emoji map...'));

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

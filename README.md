# simple-emoji-map

A simple emoji map package that builds its data whenever it's installed.

This package maps the emoji codes (`2049`) and sets them equal to its shortnames (`["interrobang","exclamation_question"]`).

## Usage

```js
const emojis = require('simple-emoji-map');
```

Or using ES6 imports:

```js
import emojis from 'simple-emoji-map';
```

## Rebuilding

The JSON file is automatically generated on install.

To rebuild the JSON data file, it's a pretty simple process.

```js
const build = require('simple-emoji-map/build');
// import build from 'simple-emoji-map/build';

build();
```

## Config

To customize the build process, you will need either a `.simple-emoji-map` file or a `simple-emoji-map` property in package.json.

```js
{
  "shortnames": {},
  "type": "emoji", // or 'codepoint',
  "regex": null // regex for whitelist
}
```

### Shortnames

This is also the way to add custom shortnames to the map file.

For example, if you want `car` to show the emoji for `red_car` (`1f697`), the file or property would look something like this:

```json
{
    "shortnames": {
        "1f697": ["car"]
    }
}
```

Keep in mind this will **not** replace any existing shortnames, only add to the emoji code's list.

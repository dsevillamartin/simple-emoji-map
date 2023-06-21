# Changelog

## v0.6.0

- Update `emojibase-data` to v15.0.0 (Emoji 15 & Unicode 15)
  - Version jumped from v7 to v15 to stay with emoji versioning
- Replace `twemoji` with `@twemoji/api`
  - Twitter's Twemoji is no longer being maintained. This fork is maintained by the original maintainers that were laid off from Twitter.
  - `twemoji` hasn't been updated for Emoji 15, but this package only uses its API for the fallback build process logging, so it won't affect the output

## v0.5.1

- Add shebang line to bin file
- Update path of bin file to actual executable
- Update Twemoji to v14

## v0.5.0

**BREAKING**
If you need to keep using the same shortcodes as previous versions, set the `shortcodes.dataset` config option to `emojibase-legacy`. See README.

- Update `emojibase-data` to v7.0.0 (Emoji 14 & Unicode 14)
  - Shortcode dataset has been updated
  - Added option to choose shortcode dataset (see breaking notice)
- Added `lang` & `shortcodes.lang` options to change the data locale
- Added `shortcodes.fallbackDataset` and `shortcodes.fallbackLang` options to allow for the usage of legacy datasets while including new emojis
- Fixed `regex` option not working (flags not supported)

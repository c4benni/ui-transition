# /utils/extractConfig

A computed function to expand the `props.config` object, or string to a fully fledged object.

## `String`

If `props.config` is string, this function will look through the saved transitions found in `/state` dir

## `Object`

If `props.config` is an object, this function will expand it and add defaults. Also, if `props.config.extends` is a string, this function will look up that path in the saved transtions found in `/state`, spread it, and override.

# /utils/extractDurationAndDelay

Computed function to extract duration and delay. `duration` and `delay` priorities are as follows:

## `props.duration`

The duration passed as a prop.

## `props.config.duration || props.config.duration[animPhase]`

The duration passed in the buldAnim object.

## _duration only_

Animation actual duration (gotten from the create spring request).

#!/usr/bin/env node

/**
 * @package polymerase-cli
 * @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
 */

require('babel/register')({
   optional: ['es7.decorators'],

   // A lot of NPM modules are precompiled so Babel ignores node_modules/*
   // by default, but Needlepoint is NOT pre-compiled so we change the ignore
   // rules to ignore everything *except* Needlepoint.
   ignore: /node_modules\/(?!needlepoint)/
});

try {
    require('./program');
} catch(e) {
    console.error(e);

    process.exit(1);
}

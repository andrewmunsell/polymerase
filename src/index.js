#!/usr/bin/env node

/**
 * @package polymerase-cli
 * @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
 */

// Load the env from the filesystem in the event the user has specified a .env
// file in the CWD
require('dotenv').load({ silent: true });

require('babel/register')({
   optional: ['es7.decorators'],

   // A lot of NPM modules are precompiled so Babel ignores node_modules/*
   // by default, but Needlepoint is NOT pre-compiled so we change the ignore
   // rules to ignore everything *except* Needlepoint.
   ignore: /node_modules\/(?!needlepoint|polymerase\-.+)/
});

try {
    require('./program');
} catch(e) {
    console.error(e);
		console.error(e.stack);

    process.exit(1);
}

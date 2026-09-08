const util = require('node:util');
const moduleMod = require('node:module');

if (!util.styleText) {
  util.styleText = (format, text) => text;
}

// Fix Node 18.20.4 experimental getBuiltinModule bug with @vue-macros
if (process.getBuiltinModule) {
  delete process.getBuiltinModule;
}

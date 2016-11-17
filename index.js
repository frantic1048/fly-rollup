'use strict';

const format = require('path').format;
const parse = require('path').parse;
const rollup = require('rollup');

module.exports = function () {
  this.plugin('rollup', {every: 0}, function * (files, opts) {
    opts = Object.assign({rollup: {}, bundle: {}}, opts);
    const entry = opts.rollup.entry && [parse(opts.rollup.entry)];

    // prepare output
    const out = [];

    // if `entry` point given, use that ONLY
    for (const file of Array.from(entry || files)) {
      opts.rollup.entry = format(file);

      const bun = yield rollup.rollup(opts.rollup);
      const res = bun.generate(opts.bundle);

      file.data = res.code;

      // append sourcemap, if one
      if (opts.bundle.sourceMap && res.map) {
        file.data += new Buffer('\n//# sourceMappingURL=data:application/json;base64,');
        file.data += new Buffer(JSON.stringify(res.map).toString('base64'));
      }

      // send to output array
      out.push(file);
    }

    // save changes
    this._.files = out;
  });
};

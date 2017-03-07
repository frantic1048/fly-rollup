'use strict';

const format = require('path').format;
const parse = require('path').parse;
const rollup = require('rollup');

module.exports = function (fly) {
  fly.plugin('rollup', {every: 0}, function * (files, opts) {
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
        if (opts.bundle.sourceMap === 'inline') {
          // inline sourcemaps
          file.data += '\n//# sourceMappingURL=data:application/json;base64,';
          file.data += Buffer.from(JSON.stringify(res.map)).toString('base64');
        } else {
          // external sourcemaps
          const map = file.base + '.map';
          file.data += `\n//# sourceMappingURL=${map}`;
          out.push({
            base: map,
            dir: file.dir,
            data: Buffer.from(JSON.stringify(res.map))
          });
        }
      }

      // send to output array
      out.push(file);
    }

    // save changes
    this._.files = out;
  });
};

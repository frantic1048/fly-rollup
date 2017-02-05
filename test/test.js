'use strict';

const {join} = require('path');
const {test} = require('tape');
const Fly = require('fly');

const dir = join(__dirname, 'fixtures');
const tmp = join(__dirname, 'tmp');

const want = `var module = (function () {\n\'use strict\';\n\nvar a = function () {\n  return \'a\';\n};\n\nvar b = function () {\n  return \'b\';\n};\n\nvar entry = function () {\n  a();\n  b();\n};\n\nreturn entry;\n\n}());\n`;

const opts = {
  rollup: {
    plugins: [require('rollup-plugin-babel')()]
  },
  bundle: {
    sourceMap: false,
    moduleName: 'module',
    format: 'iife'
  }
};

test('fly-rollup', t => {
  t.plan(8);
  const fly = new Fly({
    plugins: [
      require('../'),
      require('fly-clear')
    ],
    tasks: {
      * foo(f) {
        yield f.source(`${dir}/entry.js`).rollup(opts).target(tmp);

        const res = yield f.$.read(`${tmp}/entry.js`, 'utf8');
        t.ok(res, 'writes output file');
        t.equal(res, want, 'produces correct content');

        yield f.clear(tmp);
      },
      * bar(f) {
        opts.rollup.entry = `${dir}/entry.js`;
        yield f.source(`${dir}/*.foo`).rollup(opts).target(tmp);

        const res = yield f.$.read(`${tmp}/entry.js`, 'utf8');
        t.ok(res, 'writes output file');
        t.equal(res, want, 'produces correct content');

        yield f.clear(tmp);
      },
      * baz(f) {
        opts.bundle.sourceMap = true;
        yield f.source(`${dir}/entry.js`).rollup(opts).target(tmp);

        const res = yield f.$.read(`${tmp}/entry.js`, 'utf8');
        t.ok(res, 'writes output file');
        t.true(res.indexOf(want) > -1, 'produces correct content');
        t.true(res.indexOf('# sourceMappingURL=data:application/json;base64,{"version":3,') > -1, 'appends `sourceMappingURL` content');

        yield f.clear(tmp);
      }
    }
  });
  t.true('rollup' in fly.plugins, 'attach `rollup()` plugin to fly');
  fly.serial(['foo', 'bar', 'baz']);
});

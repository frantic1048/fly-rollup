'use strict';

const join = require('path').join;
const test = require('tape');
const Fly = require('fly');

const dir = join(__dirname, 'fixtures');
const tmp = join(__dirname, 'tmp');

const want =
`var module = (function () {
'use strict';

var a = function () {
  return 'a';
};

var b = function () {
  return 'b';
};

var entry = function () {
  a();
  b();
};

return entry;

}());
`;

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
  t.plan(14);
  const fly = new Fly({
    plugins: [
      require('../'),
      require('fly-clear')
    ],
    tasks: {
      * basic(f) {
        yield f.source(`${dir}/entry.js`).rollup(opts).target(tmp);

        const res = yield f.$.read(`${tmp}/entry.js`, 'utf8');
        t.ok(res, 'writes output file');
        t.equal(res, want, 'produces correct content');

        yield f.clear(tmp);
      },
      * explicitEntryOption(f) {
        opts.rollup.entry = `${dir}/entry.js`;
        yield f.source(`${dir}/*.foo`).rollup(opts).target(tmp);

        const res = yield f.$.read(`${tmp}/entry.js`, 'utf8');
        t.ok(res, 'writes output file');
        t.equal(res, want, 'produces correct content');

        yield f.clear(tmp);
      },
      * inline(f) {
        opts.bundle.sourceMap = 'inline';
        yield f.source(`${dir}/entry.js`).rollup(opts).target(tmp);

        const res = yield f.$.read(`${tmp}/entry.js`, 'utf8');
        t.ok(res, 'writes output file');
        t.true(res.indexOf(want) > -1, 'produces correct content');
        t.true(res.indexOf('# sourceMappingURL=data:application/json;base64') > -1, 'appends `sourceMappingURL` content');

        const base64Map = res.split('base64')[1];
        const utf8Map = Buffer.from(base64Map, 'base64');
        t.doesNotThrow(JSON.parse.bind(JSON, utf8Map), 'base64 encodes inline sourcemap');
        t.equals(3, JSON.parse(utf8Map).version, 'sourcemap has correct content');

        yield f.clear(tmp);
      },
      * external(f) {
        opts.bundle.sourceMap = true;
        yield f.source(`${dir}/entry.js`).rollup(opts).target(tmp);

        const res = yield f.$.read(`${tmp}/entry.js`, 'utf8');
        const map = yield f.$.read(`${tmp}/entry.js.map`, 'utf8');
        t.ok(res, 'writes output file');
        t.true(res.indexOf(want) > -1, 'produces correct content');
        t.true(res.indexOf('# sourceMappingURL=entry.js.map') > -1, 'appends `sourceMappingURL`');
        t.true(map.indexOf('{"version":3') === 0, 'writes external sourcemap');

        yield f.clear(tmp);
      }
    }
  });
  t.true('rollup' in fly.plugins, 'attach `rollup()` plugin to fly');
  fly.serial(['basic', 'explicitEntryOption', 'inline', 'external']);
});

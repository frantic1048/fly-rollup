'use strict';

const join = require('path').join;
const test = require('tape').test;
const Fly = require('fly');

const dir = join(__dirname, 'fixtures');
const tmp = join(__dirname, 'tmp');

const want = `var module = (function () {\n'use strict';\n\nfunction a () {\n  return 'a';\n}\n\nfunction b () {\n  return 'b';\n}\n\nfunction entry () {\n  a();\n  b();\n}\n\nreturn entry;\n\n}());`;

const getOps = () => ({
  rollup: {
    plugins: [require('rollup-plugin-babel')()]
  },
  bundle: {
    sourceMap: false,
    moduleName: 'module',
    format: 'iife'
  }
});

const fly = new Fly({
  plugins: [{func: require('../')}],
  tasks: {
    a: function * (o) {
      const t = o.val;

      const opts = getOps();
      yield this.source(`${dir}/entry.js`).rollup(opts).target(tmp);

      const res = yield this.$.read(`${tmp}/entry.js`, 'utf8');
      t.ok(res, 'writes output file');
      t.equal(res, want, 'produces correct content');

      yield this.clear(tmp);
    },
    b: function * (o) {
      const t = o.val;

      const opts = getOps();
      opts.rollup.entry = `${dir}/entry.js`;
      yield this.source(`${dir}/*.foo`).rollup(opts).target(tmp);

      const res = yield this.$.read(`${tmp}/entry.js`, 'utf8');
      t.ok(res, 'writes output file');
      t.equal(res, want, 'produces correct content');

      yield this.clear(tmp);
    },
    c: function * (o) {
      const t = o.val;

      const opts = getOps();
      opts.bundle.sourceMap = true;
      yield this.source(`${dir}/entry.js`).rollup(opts).target(tmp);

      const res = yield this.$.read(`${tmp}/entry.js`, 'utf8');
      t.ok(res, 'writes output file');
      t.true(res.indexOf(want) > -1, 'produces correct content');
      t.true(res.indexOf('# sourceMappingURL=data:application/json;base64,{"version":3,') > -1, 'appends `sourceMappingURL` content');

      yield this.clear(tmp);
    }
  }
});

test('fly-rollup', t => {
  t.plan(8);
  t.true('rollup' in fly, 'attach `rollup()` plugin to fly');
  fly.serial(['a', 'b', 'c'], {val: t});
});

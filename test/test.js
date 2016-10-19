import test from 'ava'

import flyPug from '../'

const fly = {
  filter (name, plugin) {
    this[name] = plugin
  }
}

flyPug.call(fly)

test('bundle', async t => {
  const data = ''
  const options = {
    file: {
      base: 'entry.js',
      dir: 'fixtures'
    },
    rollup: { plugins: [ require('rollup-plugin-babel')() ] },
    bundle: {
      sourceMap: false,
      moduleName: 'module',
      format: 'iife'
    }
  }
  const result = await fly.rollup(data, options)
  t.is(result.ext, '.js')
  t.is(result.code, "var module = (function () {\n'use strict';\n\nfunction a () {\n  return 'a';\n}\n\nfunction b () {\n  return 'b';\n}\n\nfunction entry () {\n  a();\n  b();\n}\n\nreturn entry;\n\n}());")
})

test('bundle with sourceMap', async t => {
  const data = ''
  const options = {
    file: {
      base: 'entry.js',
      dir: 'fixtures'
    },
    rollup: { plugins: [ require('rollup-plugin-babel')() ] },
    bundle: {
      sourceMap: true,
      moduleName: 'module',
      format: 'iife'
    }
  }
  const result = await fly.rollup(data, options)
  t.is(result.ext, '.js')
  const codeBody = "var module = (function () {\n'use strict';\n\nfunction a () {\n  return 'a';\n}\n\nfunction b () {\n  return 'b';\n}\n\nfunction entry () {\n  a();\n  b();\n}\n\nreturn entry;\n\n}());"

  t.regex(result.code.replace(codeBody, ''), /\n\/\/# sourceMappingURL=data:application\/json;base64,\w+$/)
})

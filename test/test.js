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
    file: { base: 'entry.js', dir: 'fixtures' },
    rollup: { plugins: [ require('rollup-plugin-babel')() ] }
  }
  const result = await fly.rollup(data, options)
  t.is(result.ext, '.js')
  t.is(result.code, "function a () {\n  return 'a';\n}\n\nfunction b () {\n  return 'b';\n}\n\nfunction entry () {\n  a();\n  b();\n}\n\nexport default entry;")
})

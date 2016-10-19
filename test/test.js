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
  t.is(result.code, 'var module = (function () {\n\'use strict\';\n\nfunction a () {\n  return \'a\';\n}\n\nfunction b () {\n  return \'b\';\n}\n\nfunction entry () {\n  a();\n  b();\n}\n\nreturn entry;\n\n}());')
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
  t.is(result.code, 'var module = (function () {\n\'use strict\';\n\nfunction a () {\n  return \'a\';\n}\n\nfunction b () {\n  return \'b\';\n}\n\nfunction entry () {\n  a();\n  b();\n}\n\nreturn entry;\n\n}());\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi92YXIvc29yYS9jb2RlL2ZseS1yb2xsdXAvdGVzdC9maXh0dXJlcy9hLmpzIiwiL3Zhci9zb3JhL2NvZGUvZmx5LXJvbGx1cC90ZXN0L2ZpeHR1cmVzL2IuanMiLCIvdmFyL3NvcmEvY29kZS9mbHktcm9sbHVwL3Rlc3QvZml4dHVyZXMvZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gJ2EnXG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAnYidcbn1cbiIsImltcG9ydCBhIGZyb20gJy4vYSdcbmltcG9ydCBiIGZyb20gJy4vYidcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuICBhKClcbiAgYigpXG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsY0FBMkI7U0FDbEIsR0FBUDs7O0FDREYsY0FBMkI7U0FDbEIsR0FBUDs7O0FDRUYsa0JBQTJCOzs7Ozs7OyJ9')
})

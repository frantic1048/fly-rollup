# fly-rollup

[![fly badge][fly-bgp]][fly-bg] [![npm badge][npm-bgp]][npm-bg] ![download badge][dl-bgp] [![travisbadge][travis-bgp]][travis-bg] [![license badge][license-bgp]][license-bg]

[fly-bgp]: https://img.shields.io/badge/fly-JS-05B3E1.svg?style=flat-square&maxAge=2592000
[fly-bg]: https://github.com/flyjs/fly

[npm-bgp]: https://img.shields.io/npm/v/fly-rollup.svg?style=flat-square
[npm-bg]: https://www.npmjs.org/package/fly-rollup

[dl-bgp]: https://img.shields.io/npm/dm/fly-rollup.svg?style=flat-square

[travis-bgp]: https://img.shields.io/travis/frantic1048/fly-rollup.svg?style=flat-square
[travis-bg]: https://travis-ci.org/frantic1048/fly-rollup

[license-bgp]: https://img.shields.io/github/license/frantic1048/fly-rollup.svg?style=flat-square
[license-bg]: https://spdx.org/licenses/WTFPL.html

[Rollup][] plugin for *[Fly][]* .

[Fly]: https://github.com/flyjs/fly
[Rollup]: https://github.com/rollup/rollup/

## Install

This plugin requires [Fly][] .

```bash
npm i --save-dev fly-rollup
```

## Usage

Async/Await flavored:

```js
export async function roll (fly) {
  await fly
    .source('src/entry.js') // just pass your entry file(s) here
    .rollup({
      rollup: { // rollup options
        plugins: [
          require('rollup-plugin-babel')()
        ]
      },
      bundle: { // bundle options
        format: 'es'
      }
    })
    .target('dist')
}
```

Generator function flavored:

```js
exports.roll = function * (fly) {
  yield fly
    .source('src/entry.js') // just pass your entry file(s) here
    .rollup({
      rollup: { // rollup options
        plugins: [
          require('rollup-plugin-babel')()
        ]
      },
      bundle: { // bundle options
        format: 'es'
      }
    })
    .target('dist')
}
```

You just need to pass **entry** files to fly-rollup .

### Sourcemap

Sourcemap is controlled by `sourceMap` key in bundle options. It has 3 options:

- `true`: **default value**, generate external sourcemap along with bundle output.
- `'inline'`: inline sourcemap.
- `false`: disable sourcemap.


e.g.

```js
fly.source
  .rollup({
    bundle: {
      sourceMap: false // disable sourcemap
    }
  })
```

For other options:

See [Rollup JavaScript API#rollup.rollup( options )][rollup-options] for *rollup options* .

See [Rollup JavaScript API#bundle.generate( options )][bundle-options] for *bundle options* .

[rollup-options]: https://github.com/rollup/rollup/wiki/JavaScript-API#rolluprollup-options-
[bundle-options]: https://github.com/rollup/rollup/wiki/JavaScript-API#bundlegenerate-options-

## License

[Do What The F*ck You Want To Public License](https://spdx.org/licenses/WTFPL)

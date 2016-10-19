const path = require('path')
const rollup = require('rollup')

module.exports = function flyRollup () {
  return this.filter('rollup', function plugin (data, options) {
    const rollupOpt = options.rollup
    const bundleOpt = options.bundle
    const fileOpt = options.file
    rollupOpt.entry = path.resolve(path.join(fileOpt.dir, fileOpt.base))
    return rollup.rollup(rollupOpt)
      .then(function (bundle) {
        const result = bundle.generate(bundleOpt)
        const code = result.code.toString()

        let output = code

        if (bundleOpt.sourceMap) {
          const map = result.map.toString()
          output += `\n//# sourceMappingURL=data:application/json;base64,${new Buffer(map).toString('base64')}`
        }
        return {
          ext: '.js',
          code: output
        }
      })
  })
}

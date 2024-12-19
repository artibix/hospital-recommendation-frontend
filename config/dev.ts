module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  copy: {
    patterns: [
      { from: 'src/assets/', to: 'dist/assets/'},
    ],
  },
  defineConstants: {
  },
  mini: {},
  h5: {}
}

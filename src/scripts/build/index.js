if (process.argv.includes('--cli')) {
  require('./cli')
} else {
  require('./web')
}

require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
var ghpages = require('gh-pages')
var git = require('./git');
var cp = require('child_process');

var spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, ''), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: true,
      children: false,
      chunks: true,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    if (
      process.argv.length === 3 &&
      process.argv[2] === '--release'
    ) {

      var user = git.getUser();

      // 仅在主分支上发布，且当前git工作目录干净
      if (
        user.name === 'cibot' ||
        (config.build.releaseBranch === git.getBranch() &&
          git.isStatusClean())
      ) {

        var commitMsg = git.getLastCommit();

        console.log(chalk.cyan(`  Realsing ${config.build.releaseBranch} at ${commitMsg}\n`))

        ghpages.publish('dist', {
          branch: 'releaseV5.1',
          message: `release for commit: ${commitMsg}`,
          user: git.getUser(),
        }, function (err) {
          if (err) {
            console.log(chalk.red(err.message));
          } else {
            console.log(chalk.cyan(`  Realsing at ${commitMsg} Sussess!\n`))
          }
        });
      } else {
        console.error('Do not match release condition!')
        console.log(git.getBranch())
        console.log(git.isStatusClean())
      }
    }
  })
})

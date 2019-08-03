const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

// delete stage and release
try {
  fs.unlinkSync(path.join(__dirname, '/stage/ITGlue.html'));
  fs.unlinkSync(path.join(__dirname, '/release/release.zip'));
} catch (e) {
}

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.error('Fatal error during compile.');
    throw err;
  }

  // copy new build to stage
  fs.copyFileSync(path.join(__dirname, '/dist/ITGlue.html'), path.join(__dirname, '/stage/ITGlue.html'));

  buildZip();
});


function buildZip() {
  const output = fs.createWriteStream(path.join(__dirname, '/release/release.zip'));
  const archive = archiver('zip', {zlib: {level: 9}});

  output.on('close', () => console.log('release.zip created.'));

  archive.on('warning', (err) => {
    console.warn(err);
  });
  archive.on('error', (err) => {
    throw err;
  });
  archive.pipe(output);
  archive.directory('stage/', '0e68472d-e8e4-4d7a-894e-c0eec88cf731');
  archive.finalize();
}

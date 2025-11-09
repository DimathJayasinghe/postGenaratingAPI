const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const rootDir = path.resolve(__dirname, '..', '..');

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  allowOrigin: process.env.ALLOW_ORIGIN || '*',
  templatePath:
    process.env.TEMPLATE_PATH ||
    path.join(rootDir, 'templates', 'post_template.png'),
  generatedDir:
    process.env.GENERATED_DIR || path.join(rootDir, 'generated'),
};

module.exports = { config, rootDir };
require('@babel/register');
const webpackMerge = require('webpack-merge');

const common = require('./webpack.common.babel');

const envs = {
    development: 'dev',
    production: 'prod'
};

/* eslint-disable global-require,import/no-dynamic-require */
const env = envs[process.env.NODE_ENV || 'development'];
const envConfig = require(`./webpack.${env}.babel`);
module.exports = webpackMerge(common, envConfig);
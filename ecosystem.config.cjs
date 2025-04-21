module.exports = {
    apps: [
      {
        name: 'metaincognita-default',
        port: '5150',
        exec_mode: 'fork',
        interpreter : 'node@22.14.0',
        script: './.output/server/index.mjs'
      }
    ]
  }
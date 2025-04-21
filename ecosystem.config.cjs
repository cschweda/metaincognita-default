module.exports = {
    apps: [
      {
        name: 'metaincognita-default',
        port: '5150',
        exec_mode: 'fork',
        interpreter : 'node',
        script: './.output/server/index.mjs'
      }
    ]
  }
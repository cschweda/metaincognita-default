module.exports = {
    apps: [
      {
        name: 'metaincognita-default',
        port: '3000',
        exec_mode: 'fork',
        interpreter : 'node',
        script: './.output/server/index.mjs'
      }
    ]
  }

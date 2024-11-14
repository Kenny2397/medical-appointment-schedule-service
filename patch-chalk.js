const fs = require('fs')
const path = require('path')

const chalkPath = path.resolve(
  __dirname,
  'node_modules',
  'serverless-apigateway-service-proxy',
  'lib',
  'index.js'
)

fs.readFile(chalkPath, 'utf8', (err, data) => {
  if (err) return console.error(err)

  const result = data.replace(
    'const chalk = require(\'chalk\');',
    'const chalk = await import(\'chalk\');'
  )

  fs.writeFile(chalkPath, result, 'utf8', (err) => {
    if (err) return console.error(err)
    console.log('Patched serverless-apigateway-service-proxy to use dynamic import for chalk')
  })
})

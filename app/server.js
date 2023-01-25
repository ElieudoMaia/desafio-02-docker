import http from 'node:http'
import mysql from 'mysql'

const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'nodedb'
})

const server = http.createServer(async (_req, res) => {
  dbConnection.query('INSERT INTO users (name) VALUES (\'John\')')

  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World from server.js!')
})

dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting MySql: ' + err.stack)
    return
  }

  server.listen(3333, () => {
    console.log('Server running at http://localhost:3333/')
  })
  server.on('close', () => {
    dbConnection.end()
  })
})

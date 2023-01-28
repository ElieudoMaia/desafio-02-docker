import http from 'node:http';
import mysql from 'mysql';

const dbConnection = mysql.createConnection({
  host: 'mysqldb',
  user: 'root',
  password: 'root',
  database: 'nodedb',
  port: 3306,
});

const server = http.createServer(async (_req, res) => {
  const getPeople = () => {
    return new Promise((resolve, reject) => {
      dbConnection.query('SELECT * FROM people', (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  try {
    const people = await getPeople();

    const peopleNamesAsString = people.map((person) => `- ${person.name}`).join('<br />');

    const response = `<h1>Full Cycle Rocks!</h1><br />${peopleNamesAsString}`

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(response);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error: ' + error);
  }
});

dbConnection.connect(async (err) => {
  if (err) {
    console.error('Error connecting MySql: ' + err.stack);
    process.exit(1);
  }

  dbConnection.query(
    'CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))',
    (err) => {
      if (err) {
        console.error('Error creating table: ' + err.stack);
        process.exit(1);
      }

      dbConnection.query('INSERT INTO people (name) VALUES ("John"), ("Mary"), ("Antony")', (err) => {
        if (err) {
          console.error('Error inserting data: ' + err.stack);
          process.exit(1);
        }
      });
    }
  );

  server.listen(3333, () => {
    console.log('Server running at http://localhost:3333/');
  });
  server.on('close', () => {
    dbConnection.end();
    process.exit(0);
  });
});


const cors = require('cors');
const pg = require('pg');
const express = require('express');
const app = express();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/test', (req, res) => res.send('hello world'));

app.get('/api/v1/tasks', (req, res) => {
    client.query(`SELECT * from books;`)
        .then(results => res.send(result.rows))
        .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
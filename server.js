
const cors = require('cors');
const pg = require('pg');
const express = require('express');
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

client.connect();
client.on('error', err => console.error(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.send('IT WORKS'));

app.get('/api/v1/books', (req, res) => {
    client.query(`SELECT * from books;`)
        .then(results => res.send(result.rows))
        .catch(console.error);
});

app.get('api/v1/books/:id', (req, res) => {
    client.query(`SELECT * FROM books WHERE id=$1`, [req.params.id])
    .then(results => res.send(results.rows[0]))
    .catch(err => {console.error(err);
    res.sendStatus(500).send('error');
    });
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
//Is this the client side home route?

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
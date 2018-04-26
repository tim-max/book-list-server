
const fs = require('fs');
const cors = require('cors');
const pg = require('pg');
const express = require('express');
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

client.connect();
client.on('error', err => console.error(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.send('IT WORKS'));

app.get('/authenticate', (req, res) => {
    console.log("TOKEN", req.query.token, req.query.token === process.en.vTOKEN );
    res.send( req.query.token === process.ebv.TOKEN );
}) 

app.get('/api/v1/books', (req, res) => {
    client.query(`SELECT * from books;`)
        .then(results => res.send(result.rows))
        .catch(console.error);
});

app.get('/api/v1/books/:id', (req, res) => {
    client.query(`SELECT * FROM books WHERE id=$1;`, [req.params.id])
    .then(results => res.send(results.rows[0]))
    .catch(err => {console.error(err);
    res.sendStatus(500).send('error');
    });
});

app.post('/api/v1/books', (req, res) => {
    let insert = `INSERT INTO books (author, title, isbn, image_url, description) VALUES($1, $2, $3, $4, $5);`
    let values = [
        req.body.author,
        req.body.title,
        req.body.isbn,
        req.body.image_url,
        req.body.description
    ];

    client.query(insert, values)
    .then(results => res.json(results))
    .catch(err => {
        console.error(err);
        res.sendStatus(500).send('error');

   });
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
//Is this the client side home route?

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

//   Create a new endpoint at GET /api/v1/books which will retrieve an array of book objects from the database, limited to only the book_id, title, author, and image_url.
app.get('/api/v1/books', (request, response) => {
    client.query(`
      SELECT  book_id, title, author, image_url FROM books;`
    )
    .then(result => response.send(result.rows))
    .catch(console.error);
  });


app.put('/api/v1/books/:id', (request, response) => {
    client.query(`
      UPDATE books
      SET author=$1, title=$2, isbn=$3, image_url=$4, description =$5  
      WHERE book_id=$1;
      `,
        [ 
        request.body.author, 
        request.body.title, 
        request.body.isbn,
        request.body.image_url,
        request.body.description
        ]
    )

    .then(() => response.send('Update complete'))
    .catch(console.error);
  });
  app.delete('/api/v1/books/:id', (request, response) => {
    client.query(
      `DELETE FROM books WHERE book_id=$1;`,
      [request.params.id]
    )
    .then(() => response.send('Delete complete'))
    .catch(console.error);
  });
  app.delete('/books', (request, response) => {
    client.query('DELETE FROM books')
    .then(() => response.send('Delete complete'))
    .catch(console.error);
  });
//
const express = require('express');
const server = express();

// pegar o banco de dados
const db = require('./database/db');

// Configurar pasta pública
server.use(express.static('public'));

// habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }));

// Utilizando template engine
const nunjucks = require('nunjucks');
nunjucks.configure('src/views', {
  express: server,
  noCache: true,
});

// Configurar caminhos da aplicação
// Página inicial
server.get('/', (req, res) => {
  return res.render('index.html');
});

// Página create-point
server.get('/create-point', (req, res) => {
  // req.query: query strings da url

  return res.render('create-point.html');
});

server.post('/savepoint', (req, res) => {
  // req.body: corpo do formulário
  // inserir dados no banco de dados
  const query = `
       INSERT INTO places (
            image,
             name,
             address,
             address2,
             state,
             city,
             items
         ) VALUES (?,?,?,?,?,?,?);
         `;

  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
  ];

  function afterInsertData(err) {
    if (err) {
      return console.log(err);
    }

    console.log('Cadastrado com sucesso');
    console.log(this);
    return res.render('create-point.html', { saved: true });
  }

  db.run(query, values, afterInsertData);

  
});

// Página search-results
server.get('/search-results', (req, res) => {
  // pegar os dados do banco de dados
  db.all(`SELECT * FROM places`, function (err, rows) {
    if (err) {
      return console.log(err);
    }
    const total = rows.length;
    // mostrar a página html com os dados do banco de dados
    return res.render('search-results.html', { places: rows, total });
  });
});

// Ligar o servidor
server.listen(3000);

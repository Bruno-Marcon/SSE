const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const clients = [];
let items = [
  'Café',
  'Leite',
  'Ovos',
  'Pão',
  'Arroz',
  'Feijão',
  'Macarrão',
  'Molho de tomate',
  'Carne moída',
  'Frango',
  'Peito de peru',
  'Queijo',
  'Presunto',
  'Iogurte',
  'Granola',
  'Frutas',
  'Vegetais variados',
  'Batata',
  'Cenoura',
  'Cebola',
  'Alho',
  'Azeite',
  'Refrigerante',
  'Cerveja',
  'Pipoca',
  'Chocolate',
  'Cuca'
];
let comprados = [];

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  clients.push(res);

  req.on('close', () => {
    clients.splice(clients.indexOf(res), 1);
  });
});

app.get('/items', (req, res) => {
  res.json({ items });
});

app.post('/comprar', (req, res) => {
  const { item } = req.body;
  if (item && items.includes(item)) {
    comprados.push(item);
    console.log(`Item comprado: ${item}`);
    broadcastComprados();
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

function broadcastComprados() {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ comprados })}\n\n`);
  });
}

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

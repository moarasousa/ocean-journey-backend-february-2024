const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const dbUrl = 'mongodb+srv://moarasousa15:B6eXbbH5UEZUNS3S@cluster0.ec9ishh.mongodb.net'
const dbName = 'OceanJornadaBackendFev2024'

async function main() {
  const client = new MongoClient(dbUrl)

  console.log('Conectando ao banco de dados')
  await client.connect()
  console.log('Banco de dados conectado com sucesso')

  const app = express()

  app.get('/', function (req, res) {
    res.send('Hello World')
  })

  app.get('/oi', function (req, res) {
    res.send('Olá, Mundo')
  })

  // Lista de Personagens
  const lista = ['Rick Sanchez', 'Morty Smith', 'Summer Smith']

  const db = client.db(dbName)
  const collection = db.collection('item')


  // Read All -> [GET] /item
  app.get('/item', async function (req, res) {
    // Realizamos a operação de find na collection do MongoDB
    const item = await collection.find().toArray()

    // Envio todos os documentos como resposta HTTP
    res.send(item)
  })

  // Read By ID -> [GET] /item/:id
  app.get('/item/:id', async function (req, res) {
    //Acesso o ID no parâmetro de rota
    const id = req.params.id

     // Acesso o item na collection baseado no ID recebido
     const item = await collection.findOne({
      _id: new ObjectId(id)
    })

    // Envio o item obtido como resposta HTTP
    res.send(item)
  })

  // Sinalizamos que o corpo da requisição está em JSON
  app.use(express.json())

  // Create -> [POST] /item
  app.post('/item', async function (req, res) {
    // Extraímos o corpo da requisição
    const item = req.body

    // Colocamos o nome dentro da lista de itens
   await collection.insertOne(item)

    // Enviamos uma resposta de sucesso
    res.send(item)
  })

  app.listen(3000)
}

main()
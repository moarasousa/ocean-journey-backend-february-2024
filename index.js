require('dotenv').config()
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const dbUrl = process.env.DATABASE_URL
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

  // Read All -> [GET] /items
  app.get('/items', async function (req, res) {
    // Realizamos a operação de find na collection do MongoDB
    const item = await collection.find().toArray()
    // Envio todos os documentos como resposta HTTP
    res.send(item)
  })


  // Read By ID -> [GET] /items/:id
  app.get('/items/:id', async function (req, res) {
    //Acesso o ID no parâmetro de rota
    const id = req.params.id
     // Acesso o items na collection baseado no ID recebido
     const items = await collection.findOne({
      _id: new ObjectId(id)
    })
    // Envio o items obtido como resposta HTTP
    res.send(items)
  })

  // Sinalizamos que o corpo da requisição está em JSON
  app.use(express.json())


  // Create -> [POST] /items
  app.post('/items', async function (req, res) {
    // Extraímos o corpo da requisição
    const items = req.body
    // Colocamos o item dentro da lista de itens
   await collection.insertOne(items)
    // Enviamos uma resposta de sucesso
    res.send(items)
  })


  // Uptade -> [PUT] /items/:id
  app.put('/items/:id', async function (req, res){
    // Pegamos o ID recebido pela rota
    const id = req.params.id
    // Pegamos o novo items do corpo da requisição
    const novoItems = req.body
    //Atualizamos o documento na collection
    collection.updateOne(
      { _id: new ObjectId(id)},
      { $set: novoItems}
      )
    res.send('Items atualizado com sucesso')})


    // Delete -> [DELETE] /items/:id
    app.delete('/items/:id', async function (req, res){
      // Pegamos o ID da rota
      const id = req.params.id
      // Realizamos a operação de deleteOne
      await cpllection.deleteOne({ _id: new ObjectId(id)})
      //Enviamos uma mensagem de sucesso
      res.send('Item removido com sucesso')
      })

  app.listen(3000)
}

main()
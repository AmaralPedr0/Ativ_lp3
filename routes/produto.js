// Importar os módulos
const express = require('express');
const routes = express.Router();
// importa a conexão com o banco de dados
const db = require('../db/connect');

// GET (Read)
// Rota para obter (Read) os dados no BD
routes.get('/', async(req, res) => {
  // realiza a consulta no banco de dados
  //usando uma query SQL buscando os dados
  // da tabela cliente
  const result = await
  db.query('SELECT * FROM produto');
  res.status(200).json(result.rows);
});

// POST (Create)
// Rota para criar (Create) novos valores no BD
routes.post('/', async(req, res) => {
 
  const { nome, marca, preco, peso } = req.body;

  if(!nome || !marca || !preco || !peso){
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios'});
  }

  const sql = `INSERT INTO produto (nome, marca, preco, peso)
                VALUES ($1, $2, $3, $4) RETURNING *`;
  
  const valores = [nome, marca, preco, peso];
  const result = await db.query(sql,valores);


  res.status(201).json(result.rows[0]);
});

// PUT (Update)
// Rota para atualizar (Update) valores no BD
routes.put('/:id', async(req, res) => {
  const { id } = req.params;

  if(!id){
    return res.status(400).json({
      mensagem: 'O id precisa ser informado'});
  }

  const {nome, marca, preco, peso} = req.body;

  if(!nome || !marca || !preco || !peso){
    return res.status(400).json({mensagem:'Todos os campos são obrigatórios.'});
  }

  const sql = `
    UPDATE produto
    SET nome = $1,marca = $2, preco = $3, peso = $4
    WHERE id = $5
    RETURNING *
  `;

  const valores = [nome, marca, preco, peso, id];

  const result = await db.query(sql, valores);

  if(result.rows.length === 0){
    return res.status(404).json({
      mensagem: 'Cliente não encontrado.'});
  }

  res.status(200).json(result.rows[0]);
});

// DELETE (Delete)
// Rota para excluir (Delete) valores do BD
routes.delete('/:id', async ( req, res) => {
  const { id } = req.params;

  if(!id){
    return res.status(400).json({
      mensagem: 'O id precisa ser informado'});
  }

  const sql = `
  DELETE FROM produto
  WHERE id = $1
  RETURNING *
  `;

  const valores = [id];

  const result = await db.query(sql, valores);

  if(result.rows.length === 0){
    return res.status(404).json({
      mensagem: 'Cliente não encontrado.'});
  }

  res.status(200).json({
    mensagem: `Cliente com ID ${id} foi excluído com sucesso`});
});

// Exportar o módulo com as rotas
module.exports = routes;


// Importar os módulos necessários
const express = require('express');
const routes = express.Router();
// Importa a conexão com o banco de dados PostgreSQL
const db = require('../db/connect');

// GET (Read)
// Rota para obter todos os produtos do banco de dados
routes.get('/', async(req, res) => {
  // Executa uma consulta SQL para buscar todos os produtos
  const result = await db.query('SELECT * FROM produto');
  // Retorna os produtos encontrados em formato JSON
  res.status(200).json(result.rows);
});

// POST (Create)
// Rota para criar um novo produto no banco de dados
routes.post('/', async(req, res) => {
  // Extrai os dados do corpo da requisição
  const { nome, marca, preco, peso } = req.body;

  // Verifica se todos os campos obrigatórios foram preenchidos
  if(!nome || !marca || !preco || !peso){
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios'});
  }

  // Monta a query SQL para inserir um novo produto
  const sql = `INSERT INTO produto (nome, marca, preco, peso)
                VALUES ($1, $2, $3, $4) RETURNING *`;
  
  // Define os valores a serem inseridos
  const valores = [nome, marca, preco, peso];
  // Executa a query no banco de dados
  const result = await db.query(sql,valores);

  // Retorna o produto criado com status 201 (criado)
  res.status(201).json(result.rows[0]);
});

// PUT (Update)
// Rota para atualizar um produto existente
routes.put('/:id', async(req, res) => {
  // Obtém o id do produto a ser atualizado
  const { id } = req.params;

  // Verifica se o id foi informado
  if(!id){
    return res.status(400).json({
      mensagem: 'O id precisa ser informado'});
  }

  // Extrai os novos dados do corpo da requisição
  const {nome, marca, preco, peso} = req.body;

  // Verifica se todos os campos obrigatórios foram preenchidos
  if(!nome || !marca || !preco || !peso){
    return res.status(400).json({mensagem:'Todos os campos são obrigatórios.'});
  }

  // Monta a query SQL para atualizar o produto
  const sql = `
    UPDATE produto
    SET nome = $1,marca = $2, preco = $3, peso = $4
    WHERE id = $5
    RETURNING *
  `;

  // Define os valores para a atualização
  const valores = [nome, marca, preco, peso, id];

  // Executa a query de atualização
  const result = await db.query(sql, valores);

  // Se nenhum produto foi encontrado para atualizar, retorna 404
  if(result.rows.length === 0){
    return res.status(404).json({
      mensagem: 'Produto não encontrado.'});
  }

  // Retorna o produto atualizado
  res.status(200).json(result.rows[0]);
});

// DELETE (Delete)
// Rota para excluir um produto do banco de dados
routes.delete('/:id', async ( req, res) => {
  // Obtém o id do produto a ser excluído
  const { id } = req.params;

  // Verifica se o id foi informado
  if(!id){
    return res.status(400).json({
      mensagem: 'O id precisa ser informado'});
  }

  // Monta a query SQL para deletar o produto
  const sql = `
  DELETE FROM produto
  WHERE id = $1
  RETURNING *
  `;

  // Define o id do produto a ser excluído
  const valores = [id];

  // Executa a query de exclusão
  const result = await db.query(sql, valores);

  // Se nenhum produto foi encontrado para excluir, retorna 404
  if(result.rows.length === 0){
    return res.status(404).json({
      mensagem: 'Produto não encontrado.'});
  }

  // Retorna mensagem de sucesso na exclusão
  res.status(200).json({
    mensagem: `Produto com ID ${id} foi excluído com sucesso`});
});

// Exporta o módulo com as rotas para ser usado em outros arquivos
module.exports = routes

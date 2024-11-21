"use strict";

const express = require('express');
const cors = require('../../headerCORS');
const mongoose = require('../../mongoDB');  // Importamos la conexión ya realizada en mongoDB.js
const Author = require('../../models/author');
const Publisher = require('../../models/publisher');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const Joi = require('joi'); // Usamos Joi para la validación de los datos de entrada
require('dotenv').config();

// Configurar Express
const app = express();

// Usar middleware para parsear JSON, habilitar CORS y añadir seguridad con Helmet
app.use(express.json());
app.use(cors);
app.use(helmet());  // Protege las cabeceras HTTP

// Middleware de autenticación
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;  // Añadimos la información del usuario a la solicitud
    next();
  });
};

// Esquema de validación para autores usando Joi
const authorSchema = Joi.object({
  id: Joi.string().required(),
  author: Joi.string().required(),
  nationality: Joi.string().required(),
  birth_year: Joi.number().required(),
  fields: Joi.array().items(Joi.string()).required(),
  books: Joi.array().items(Joi.string()).required(),
});

// Esquema de validación para editores usando Joi
const publisherSchema = Joi.object({
  id: Joi.string().required(),
  publisher: Joi.string().required(),
  country: Joi.string().required(),
  founded: Joi.number().required(),
  genre: Joi.string().required(),
  books: Joi.array().items(Joi.string()).required(),
});

// Rutas para autores
app.get('/.netlify/functions/server/authors', authenticateJWT, async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo autores: ' + err.message });
  }
});

app.get('/.netlify/functions/server/authors/:id', authenticateJWT, async (req, res) => {
  try {
    const author = await Author.findOne({ id: req.params.id });
    if (!author) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo el autor: ' + err.message });
  }
});

app.post('/.netlify/functions/server/authors', authenticateJWT, async (req, res) => {
  try {
    // Validar los datos entrantes con Joi
    const { error } = authorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Datos inválidos: ' + error.details[0].message });
    }

    const { id, author, nationality, birth_year, fields, books } = req.body;
    const newAuthor = new Author({ id, author, nationality, birth_year, fields, books });

    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (err) {
    res.status(400).json({ message: 'Error creando autor: ' + err.message });
  }
});

app.put('/.netlify/functions/server/authors/:id', authenticateJWT, async (req, res) => {
  try {
    // Validar los datos entrantes con Joi
    const { error } = authorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Datos inválidos: ' + error.details[0].message });
    }

    const updatedAuthor = await Author.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar autor: ' + err.message });
  }
});

app.delete('/.netlify/functions/server/authors/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedAuthor = await Author.findOneAndDelete({ id: req.params.id });
    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }
    res.json({ message: 'Autor eliminado', author: deletedAuthor });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar autor: ' + err.message });
  }
});

// Rutas para editores
app.get('/.netlify/functions/server/publishers', authenticateJWT, async (req, res) => {
  try {
    const publishers = await Publisher.find();
    res.json(publishers);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo editores: ' + err.message });
  }
});

app.get('/.netlify/functions/server/publishers/:id', authenticateJWT, async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ id: req.params.id });
    if (!publisher) {
      return res.status(404).json({ message: 'Editor no encontrado' });
    }
    res.json(publisher);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo el editor: ' + err.message });
  }
});

app.post('/.netlify/functions/server/publishers', authenticateJWT, async (req, res) => {
  try {
    // Validar los datos entrantes con Joi
    const { error } = publisherSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Datos inválidos: ' + error.details[0].message });
    }

    const { id, publisher, country, founded, genre, books } = req.body;
    const newPublisher = new Publisher({ id, publisher, country, founded, genre, books });

    const savedPublisher = await newPublisher.save();
    res.status(201).json(savedPublisher);
  } catch (err) {
    res.status(400).json({ message: 'Error creando editor: ' + err.message });
  }
});

app.put('/.netlify/functions/server/publishers/:id', authenticateJWT, async (req, res) => {
  try {
    // Validar los datos entrantes con Joi
    const { error } = publisherSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Datos inválidos: ' + error.details[0].message });
    }

    const updatedPublisher = await Publisher.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPublisher) {
      return res.status(404).json({ message: 'Editor no encontrado' });
    }
    res.json(updatedPublisher);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar editor: ' + err.message });
  }
});

app.delete('/.netlify/functions/server/publishers/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedPublisher = await Publisher.findOneAndDelete({ id: req.params.id });
    if (!deletedPublisher) {
      return res.status(404).json({ message: 'Editor no encontrado' });
    }
    res.json({ message: 'Editor eliminado', publisher: deletedPublisher });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar editor: ' + err.message });
  }
});

// Exportar como función sin servidor (serverless function)
module.exports.handler = serverless(app);

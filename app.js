const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const connectDB = require('./db/conn');
require('dotenv').config();

// Importa models
const User = require('models/user');
const Idea = require('models/idea');

const app = express();

// Conecta ao MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
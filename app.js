const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const helmet = require('helmet');
const connectDB = require('./db/conn');
require('dotenv').config();

// Importa models
const User = require('models/user');
const Idea = require('models/idea');

// Inporta rotas
const userRoutes = require('./routes/userRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const voteRoutes = require('./routes/voteRoutes');

const app = express();

// Conecta ao MongoDB
connectDB();

// Configura segurança básica
app.use(helmet());

// Sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

// Configura Handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares básicos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logger simples
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/users', userRoutes);
app.use('/ideas', ideaRoutes);
app.use('/votes', voteRoutes);

// Página inicial
app.get('/', (req, res) => {
  res.redirect('/ideas');
});

module.exports = app;
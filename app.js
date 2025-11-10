const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const connectDB = require('./db/conn');
require('dotenv').config();

// Models
const User = require('./models/User');
const Idea = require('./models/Idea');

// Routes
const userRoutes = require('./routes/userRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const voteRoutes = require('./routes/voteRoutes');

const app = express();

// 🔗 Conexão com o banco
connectDB();

// 🛡️ Segurança básica
app.use(
  helmet({
    contentSecurityPolicy: false, // necessário para evitar conflito com Bootstrap e Handlebars
  })
);

// 💾 Sessão com MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'segredo_super_seguro',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // 1 dia
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
      httpOnly: true,
      sameSite: 'lax', // importante para evitar bloqueios do Chrome
      secure: false,   // deixe false no localhost (true em HTTPS)
    },
  })
);


// 🔔 Flash messages
app.use(flash());

// 🔍 Middlewares globais (usuário, mensagens)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// ⚙️ Configuração do Handlebars com helpers personalizados
app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      // ✅ Helper de comparação seguro para IDs e strings
      eq: (a, b) => String(a) === String(b),

      // 🗓️ Helper para formatação de data
      formatDate: (date) =>
        new Date(date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
    },
  })
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 📦 Middlewares básicos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🧾 Logger simples
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 🚏 Rotas principais
app.use('/users', userRoutes);
app.use('/ideas', ideaRoutes);
app.use('/votes', voteRoutes);

// 🏠 Página inicial (home inteligente)
app.get('/', async (req, res) => {
  if (req.session.user) {
    // Usuário logado → mostra ideias
    const ideas = await Idea.find().populate('authorId').lean();
    return res.render('ideas/list', {
      title: 'Ideias Recentes',
      ideas,
      user: req.session.user,
    });
  } else {
    // Usuário não logado → mostra tela de boas-vindas
    return res.render('home', {
      title: 'Bem-vindo ao PlatIdea',
    });
  }
});

// 🧩 404
app.use((req, res) => {
  res.status(404).render('404', {
    layout: 'main',
    title: 'Página não encontrada',
  });
});

module.exports = app;

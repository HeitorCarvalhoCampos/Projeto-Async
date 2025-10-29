const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => {
            if (!date) return '';
            try {
              return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
            } catch (err) {
              console.error('Erro ao formatar data:', err);
              return new Date(date).toLocaleString('pt-BR');
            }
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rotas: Usuário
app.get('/users/login', (req, res) => {
    res.render('users/login');
});
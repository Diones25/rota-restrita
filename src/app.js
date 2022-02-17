const express = require('express');
const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

const { eAdmin } = require('./middlewares/auth');
const conn = require('./db/conn');
const User = require('./models/User');

app.use(express.json());

app.get('/', eAdmin , async (req, res) => {
  await User.findAll({
    attributes: ['id', 'name', 'email'],
    order: [['id', "DESC"]]

  }).then((users) => {
    return res.json({
      erro: false,
      users: users,
      id_usuario_logado: req.userId
    });

  }).catch(() => {
    return res.status(400).json({
      erro: true,
      mensagem: "ERRO: nenhum usuário encontrado!"
    });
  });


});

app.post('/cadastrar', async (req, res) => {
  //$2a$08$wlYEWbiJA.j./LBPUFpitee3t2sdUKPmAzmim.OoPxKku9dB7WfRO
  var dados = req.body;
  dados.password =  await bcrypt.hash(dados.password, 8);

  //console.log(dados);

  await User.create(dados).then(() => {    
    return res.json({
      erro: false,
      mensagem: "Usuario cadastrado com sucesso!"
    });
  }).catch(() => {
    return res.status(400).json({
      erro: true,
      mensagem: "ERRO: Não foi possível cadastrar o usuário!"
    });
  });
    
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: {
      email: req.body.email
    }
  });

  if(user === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "ERRO: usuário ou senha incorreta!"
    });
  }

  if(!(await bcrypt.compare(req.body.password, user.password) )) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: usuário ou senha incorreta!"
    });
  }

  let token = jwt.sign({ id: user.id }, "SW2C56NHU7891DXCX2@M#OI+-JY65AW", {
    //expiresIn: 600 // 10 MINUTOS
    //expiresIn: 60 // 1 min    
    expiresIn: '7D' // 7 dias    
  });

  return res.json({
    erro: false,
    mensagem: "Login realizado com sucesso!",
    token
  });

});

conn
//.sync({ force: true })
.sync()
.then(() => {

  app.listen(5000, () => {
    console.log(chalk.bgGreen.blackBright('Servidor rodando na porta 5000'));
  })

}).catch((err) => {
  console.log(chalk.bgRedBright(`Erro ao conectar com o banco de dados: ${err}`));
})

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
  return res.json({
    erro: false,
    mensagem: "Listar usuários",
    id_usuario_logado: req.userId
  });

});

app.post('/cadastrar', async (req, res) => {
  //$2a$08$wlYEWbiJA.j./LBPUFpitee3t2sdUKPmAzmim.OoPxKku9dB7WfRO
  const password =  await bcrypt.hash("123456", 8);

  console.log(password);
  return res.json({
    erro: false,
    mensagem: "Usuario cadastrado com sucesso!"
  });

});

app.post('/login', async (req, res) => {

  console.log(req.body);

  if(req.body.email != "pereiradiones987@gmail.com") {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: usuário ou senha incorreta! E-mail incorreto! "
    });
  }

  if(!(await bcrypt.compare(req.body.password, "$2a$08$wlYEWbiJA.j./LBPUFpitee3t2sdUKPmAzmim.OoPxKku9dB7WfRO") )) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: usuário ou senha incorreta! Senha incorreto! "
    });
  }

  let token = jwt.sign({ id: 3 }, "SW2C56NHU7891DXCX2@M#OI+-JY65AW", {
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

conn.sync().then(() => {

  app.listen(5000, () => {
    console.log(chalk.bgGreen.blackBright('Servidor rodando na porta 5000'));
  })

}).catch((err) => {
  console.log(chalk.bgRedBright(`Erro ao conectar com o banco de dados: ${err}`));
})

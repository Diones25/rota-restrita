const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const chalk = require('chalk');

module.exports = {
  eAdmin: async function(req, res, next){
    const authHeader = req.headers.authorization;
    //console.log(chalk.bgBlueBright.black(authHeader));

    if( !authHeader ) {
      return res.status(400).json({
        err: true,
        messagem: "Erro: Necessário realizaro login para acessar a página! Falta o token A! "
      });
    }

    const [bearer, token] = authHeader.split(' ');
    //console.log(chalk.bgBlueBright.black(`Token: ${token}`))

    if(!token) {
      return res.status(400).json({
        err: true,
        messagem: "Erro: Necessário realizaro login para acessar a página! Falta o token B! "
      });
    }
    try {

      const decode = await promisify(jwt.verify)(token, "SW2C56NHU7891DXCX2@M#OI+-JY65AW");
      req.userId = decode.id;
      return next();

    }catch(err) {
      
      return res.status(400).json({
        err: true,
        messagem: "Erro: Necessário realizaro login para acessar a página! token inválido! "
      });

    }
  }
}
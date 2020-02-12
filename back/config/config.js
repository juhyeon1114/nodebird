const dotenv = require('dotenv');

dotenv.config(); // config.json -> config.js + dotenv 모듈 : 비밀번호와 같은 중요 정보를 소스코드에 노출시키지 않기 위함

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "vue-nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "vue-nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "vue-nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql",
  }
}

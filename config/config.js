module.exports = {
  development: {
    url: 'postgres://<username>:<password>@localhost:5432/test_nodejs_api',
    dialect: 'postgres',
    dialectOptions: {
        rejectUnauthorized: false
    }
  },
  test: {
    url: 'postgres://<username>:<password>@localhost:5432/test_nodejs_api',
    dialect: 'postgres',
    dialectOptions: {
        rejectUnauthorized: false
    }
  },
  /*production: {
    username: root,
    password: null,
    database: database_production,
    host: 127.0.0.1,
    dialect: mysql
  }*/
}

const express = require('express');
const cors = require('cors');
require("dotenv").config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Import Swagger configuration
const { sequelize } = require('./models');
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(__dirname + '/public'));
const Route = require('./route');
const connectDB = async() => {
    console.log("trying connecting tp datatbase..");
    try {
        await sequelize.authenticate();
        console.log("Database connection success....");
    } catch(error){
        console.log("Database connection failed", error);
        process.exit(1);
    }
}
(async() => {
    await connectDB();
    app.listen(process.env.API_PORT, () => {
        console.log("server listening on port " + process.env.API_PORT)
    })
})();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/v1/api/', Route);
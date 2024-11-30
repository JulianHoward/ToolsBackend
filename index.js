const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;


const Stripe = require('stripe');
const stripe = Stripe('sk_test_51QP91GLLzagkDKpS7wQz3ETsX6gi1869fD3xDdMKRTZSBMfI3QtqUYRdgRA1LiPfWZGP99KDaY3efaGeK1UrshIZ00CPLo8nll');

//sesiones
app.set('trust proxy', 1);
app.use(session({
    secret: 'howard',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

//body parser para leer los datos del formulario
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({message: "Invalid data" })
    }
    next();
});

//base de datos
const db = require("./models");
db.sequelize.sync(/*{ force: true }*/).then(() => {
    console.log("db resync");
});

// Multer
app.use(express.static('public'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/productos');
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id + '.jpg');
    }
});

const upload = multer({ storage: storage });
module.exports = { upload };
    

require("./routes")(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
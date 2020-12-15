require('./models/User');
require('./models/Track');

const express =  require('express');
const mongoose = require('mongoose');
const authRouter =  require('./routes/authRoutes')
const trackRouter =  require('./routes/trackRoutes')
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(bodyParser.json());
app.use(authRouter);
app.use(trackRouter);

const mongoUri = "mongodb+srv://admin:passwordpassword@cluster0.ozmzo.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Conneceted to mongoDB.')
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongoDB', err)
});


app.get('/', requireAuth, (req, res) => {
    res.send(`Your e-mail is ${req.user.email}`);
});

app.listen('3000', () =>{
    console.log('Listening on port 3000...')
})
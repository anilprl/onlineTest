import express from 'express';
import config from 'config';
import bodyParser from 'body-parser';
import router from './router.js'
import './dbConnection.js';

const app = express();
const port = config.get('port');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('working fine');
    // console.log(port)
})

app.listen(port, (err) => {
    if(err){
        console.log(`Error occurred: ${err.message}`);
    }
    console.log(`server is running at ${port}..`)
})


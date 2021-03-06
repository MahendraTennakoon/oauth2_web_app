const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const nocache = require('nocache');
const express = require('express');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

const SESSION_IDS = new Map();
  // Applying middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(nocache());

// Views
app.use(express.static('views'));

app.post('/token', (req, res) => {
    axios.post('https://github.com/login/oauth/access_token', {
        "client_id": "f307b77e352aff8b7455",
        "client_secret": "1f6398ae41a48b140928441387e822fa414d628c",
        "code": req.body.code,
        "redirect_uri": "http://localhost:4200/data",
        "state": "111111"
      })
        .then(function (response) {
          res.send({ "access_token": response.data.split('&')[0].split('=')[1] })
        })
        .catch(function (error) {
          console.log(error);
        });
});

app.post('/data', (req, res, next) => {
    axios.get('https://api.github.com/user?access_token='+req.body.accessToken)
      .then(function (data) {
        res.send(data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
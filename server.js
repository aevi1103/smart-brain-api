const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const knex = require('knex');

const register = require('./controller/register')
const signin = require('./controller/signin')
const image = require('./controller/image')
const profile = require('./controller/profile')

const db = knex({
    client: 'pg',
    connection: {
      connectString : process.env.DATABASE_URL,
      ssl: true
    }
  });

const app = express();
app.use(bodyParser.json())
app.use(cors())

findUserByid = (id) => {findUserByid
    return db.select('*').from('users').where('id', id)
}

// app.get('/', (req, res) => {
//     db.select('*').from('users')
//         .then(data => {
//             res.send(data)
//         })
// });

app.get('/', (req, res) => {
    res.send('it is working')
});


app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handlerRegister(db, bcrypt))
app.get('/profile/:id', (req, res) => profile.handlerProfile(req, res, findUserByid))
app.put('/image', (req, res) => image.handlerImage(req, res, db, findUserByid))
app.post('/imageurl', image.hanldeApiCall)

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})

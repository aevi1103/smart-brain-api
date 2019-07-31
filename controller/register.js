
const saltRounds = 10;

const handlerRegister = (db, bcrypt) => (req, res) => {

    const { name , email, password } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json("incorrent form submission");
    }

    bcrypt.hash(password, saltRounds, function(err, hash) {

        console.log('db is not working?... ', db)

        if (err) {
            return res.status(400).send('bcrypt error', err)
        }

        db.transaction(trx => {

            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {

                return trx('users')
                        .returning('*')
                        .insert({
                            name: name,
                            email: loginEmail[0],
                            joined: new Date()
                        })
                        .then(userResponse => {
                            res.json(userResponse[0]) 
                        })

            })
            .then(trx.commit)
            .catch(trx.rollback)

        })
        .catch(err => res.status(404).json('unable to register!'))

    });
}

module.exports = {
    handlerRegister: handlerRegister
}
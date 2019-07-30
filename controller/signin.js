
const handleSignin = (db, bcrypt) => (req, res) => {

    const { email, password } = req.body;

    if (!email || !password ) {
        return res.status(400).json("incorrent form submission");
    }

    const userInfo = db.select('users.id', 'name', 'entries', 'joined','login.hash')
                        .from('users')
                        .innerJoin('login', 'users.email', 'login.email')
                        .where('users.email', email)

    userInfo
        .then(data => {
            if (data.length) {

                const user = data[0];
                bcrypt.compare(password, user.hash, function(err, result) {
                    
                    if (err) {
                        console.error(error)
                    }
        
                    if (result) {
                        res.json(user)
                    } else {
                        res.status(400).json('wrong credentials')
                    }
                });
        
            } else{
                res.status(400).json('wrong credentials')
            }

        })
        .catch(err => res.status(404).json(err))
}

module.exports = {
    handleSignin: handleSignin
}
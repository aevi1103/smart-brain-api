
const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'c66a610d37c74f4cbc566e96c01c7537'
});

const hanldeApiCall = (req, res) => { 
    app.models.
        predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('unable to work with api'))
};

const handlerImage = (req, res, db, findUserByid) => {
    const { id } = req.body;
    findUserByid(id)
        .then(data => {
            const user = data[0];
            if (user) {
                db('users')
                .where('id','=', id)
                .increment('entries', 1)
                .returning('entries')
                .then(entries => {
                    res.json(entries[0])  
                })
                .catch(err => {
                    res.status(400).json('unable to get entries')
                })
                
            } else{
                res.status(400).json('no such user')
            }
        })
        .catch(err => res.status(404).json(err))
}

module.exports = {
    handlerImage,
    hanldeApiCall
}
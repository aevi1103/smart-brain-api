
const handlerProfile = (req, res, findUserByid) => {

    const { id } = req.params;

    findUserByid(id)
        .then(data => {
            const user = data[0]
            if (user) {
                res.json(user)
            } else{
                res.status(400).json('no such user')
            }
    })    
}

module.exports = {
    handlerProfile: handlerProfile
}
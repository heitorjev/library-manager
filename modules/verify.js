const rl = (req, res, next) =>{
    if(!req.session.userId){
        res.redirect('/auth/login')
    }else{
        next()
    }
}
const rH = (req, res, next) =>{
    if(req.session.userId){
        res.redirect('/dash')
    }else{
        next()
    }
}

module.exports = {rl, rH}   
const rl = (req, res, next) =>{
    if(!req.session.userId){
        res.redirect('/dash/login')
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
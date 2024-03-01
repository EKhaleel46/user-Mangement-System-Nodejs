const islogin = async (req,res,next)=>{
    try{
        if(req.session.Admin_id){
            next()
        }
        else{
            res.redirect('/admin')
        }
    }catch(e){
        console.log(e.message);
    }
}

const islogout = async (req,res,next)=>{
    try{
        if(req.session.Admin_id){
            res.redirect('/admin/Dashboard')
        }else{
            next();
        }        
    }catch(e){
        console.log(e.message);
    }
}

module.exports = {
    islogin,
    islogout
}
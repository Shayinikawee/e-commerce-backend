import User from "../modales/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res){
    const hashpassword = bcrypt.hashSync(req.body.password ,10)

    const user = new User({
        email : req.body.email,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : req.body.password,
    })

user
    .save()
    .then(()=>{
        res.json( { message : "User created Successfully", });
    })
    .catch((error)=>{
        res.json({message : "User creation Failed", error: error});
});
}

export function loginUser(req, res) {
    User.findOne({
        email: req.body.email,
    })
        .then((user) => {
            if (user == null) {
                res.json({
                    message: "User with given email not found",
                });
            } else {
                const isPasswordValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (isPasswordValid) {

                    const token = jwt.sign(
                    {
                        email : user.email,
                        firstname : user.firstName,
                        lastName : user.lastName,
                        role : user.role,
                        image : user.image,
                        isEmailVerified: user.isEmailVarified,
                    }, 
                    "i-compiyuters 54"
                );
                    console.log(token)
                    

                    res.json({
                        message: "Login successfull",
                    });
                } else {
                    res.status(401).json({
                        message: "Login failed",
                    });
                }
            }
        })
        .catch(() => {
            res.status(500).json({
                message: "Internal server error",
            });
        });
}

export function isAdmin(req){
	if(req.user == null){
		return false
	}
	if(req.user.role == "admin"){
		return true
	}else{
		return false
	}
}

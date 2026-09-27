const prisma = require("../lib/prisma.js");

const adminMiddleware = async(req, res, next) => {
    try{
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId,
            },
        })

        if(!user){
            return res.status(404).json({ message: "User not Found " }) 
        }

        if(user.role !== "ADMIN"){
            return res.status(403).json({ message: "Acesso negado" })
        }

        next()
    } catch (error){
        return res.status(500).json({ message: "Error server internal" })
    }
}

module.exports = adminMiddleware
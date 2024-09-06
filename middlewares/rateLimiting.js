const accessSchema = require("../schemas/accessSchema");


const rateLimiting = async (req, res, next) => {
    const sid = req.session.id; //req.session doesnot show id but, it is there
    try {
        const accessDb = await accessSchema.findOne({sessionId: sid})
        // if null creaes an entry
        if(!accessDb){
            const accessObj = new accessSchema({sessionId: sid, time: Date.now()})
            await accessObj.save()
            next()
            return;
        }
        // already a entry there, do time comparison
        const diff = (Date.now() - accessDb.time) / (1000 * 60) // 1hit per min
        if(diff < 1){
            return res.send({
                status: 400,
                message: "Too many request, please wait for some time."
            })
        }
        await accessSchema.findOneAndUpdate({sessionId: sid}, {time: Date.now()})
        next() 
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error",
            error: error
        })
    }
}

module.exports = {rateLimiting}
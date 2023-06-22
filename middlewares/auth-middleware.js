const jwt = require("jsonwebtoken")
const User = require("../schemas/user")

module.exports = async (req, res, next) => {
    const {Authorization} = req.cookies
    //Bearer zxcv.asdf.aqwer
    //Authorization이 없을 경우 빈 문자열로 만들어 주고 split함
    const [authType, authToken] = (Authorization ?? "").split()

    if(authType !== "Bearer" || !authToken){
        res.status(400).json({errorMessage: "로그인 후에 이용할 수 있는 기능입니다."})
        return
    }

    try{
        const {userId} = jwt.verify(authToken, "customized-secret-key")
        const user = await User.findById(userId);
        // db에서 userId로 사용자 정보를 가져왔으므로, 
        res.locals.user = user; 
        // 이 미들웨어를 통과하는 라우터에서 계속 가져온 정보를 사용할 수 있게함
        next();
    } catch (error) {
        console.error(error)
        res.status(400).json({errorMessage: "로그인 후에 사용할 수 있습니다."})
}





}
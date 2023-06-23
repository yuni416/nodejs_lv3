const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// 로그인 API
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;

  const user = await User.findOne({ nickname });

  // 일치하는 닉넴이 없음 / 닉넴은 있으나 비밀번호가 일치하지 않음
  if (!user || password !== user.password) {
    res.status(400).json({
      errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

    const token = jwt.sign( { userId: user.userId }, process.env.DB_SECRETKEY );

    res.cookie("Authorization", `Bearer ${token}`); //JWT를 Cookie로 할당!
    res.status(200).json({ token }); //JWT를 Body로 할당
});

module.exports = router;
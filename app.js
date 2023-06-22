const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const port = 3000;

//schemas의 index 파일에 연결
const connect = require("./schemas");
connect ();

app.use(express.json());
app.use(cookieParser()) 
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')

app.use("/api", [postsRouter, commentsRouter, userRouter, authRouter]);


app.listen(port, () => {
    console.log(`${port} 포트 서버가 열렸어요.`);
});
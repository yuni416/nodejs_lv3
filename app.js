const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

//미리 상위 주소를 지정, 라우츠 폴더 내의 각 파일의 routes에 적용 
const postsRouter = require('./routes/posts');
app.use('/posts', [postsRouter]);

const commentsRouter = require('./routes/comments');
app.use('/comments', [commentsRouter]);

//schemas의 index 파일에 연결
const connect = require("./schemas");
connect ();

app.listen(port, () => {
    console.log(`${port} 포트 서버가 열렸어요.`);
});
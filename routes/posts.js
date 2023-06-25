//express 기능 사용
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware")
exports.router = router;

const { Posts } = require("../models");

router.route('/posts')
    //게시글 조회
    .get(authMiddleware, async (req, res) => {
        const { userId } = res.locals.user
        const results = await Posts.findById({
            where: { userId: userId },
            attributes: ['postId', 'nickname', 'title', 'content', 'createdAt', 'userId']
        })
        //json화+data값에 넣어주는 작업
        res.json({ data: results })
    })
    //게시글 작성
    .post(authMiddleware, async (req, res) => {
        try {
            const { userId } = res.locals.user
            const { nickname, content } = req.body
            await Posts.create({ nickname, content, userId })
            res.status(200).json({ message: '게시글을 생성하였습니다.' })
        } catch {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
        }
    })

router.route('/posts/:_postId')
    //게시글 상세 조회
    .get(async (req, res) => {
        try {
            const postId = req.params._postId
            const results = await Posts.findById({
                where: { postId: postId },
                attributes: ['postId', 'nickname', 'title', 'content', 'createdAt']
            })
            res.status(200).json({ data: results })
        } catch {
            res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." })
        }
    })
    //게시글 수정
    .put(authMiddleware, async (req, res) => {
        try {
            const { userId } = res.locals.user
            const postId = req.params._postId
            const { password, nickname, title, content } = req.body
            const post = await Posts.findById({ where: { postId, userId } })
            if (!post) {
                return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' })
            }
            if (password === post.password) {
                await Posts.updateOne({ title, content }, {
                    where: {
                        [Op.and]: [{ nickname }, [{ content }, { title }]
                        ]
                    }
                }
                )
                return res.status(200).json({ message: '게시글을 수정하였습니다.' })
            } else {
                return res.status(404).json
            }
        }
        // catch 뒤에 (e)하고 send에 ({message: e.message})하면 에러메시지 확인 가능
        catch {
            res.status(400).status({ message: '데이터 형식이 올바르지 않습니다.' })
        }
    })
    .delete(authMiddleware, async (req, res) => {
        try {
            const { userId } = res.locals.user
            const postId = req.params._postId
            const { password } = req.body
            // [ ]?
            const [post] = await Posts.find({ where: { postId } })
            if (!post) {
                return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' })
            }
            if (password === post.password) {
                await Posts.deleteOne({ where: { postId } })
                return res.status(200).json({ message: '게시글을 삭제하였습니다.' })
            } else {
                return res.status(404).json
            }
        } catch {
            res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' })
        }
    })

module.exports = router
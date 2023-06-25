//express 기능 사용
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware")

const { Comments } = require("../models");

router.route('/comments/:_postId')
    //댓글 목록 조회
    .get(async (req, res) => {
        try {
            const postId = req.params._postId
            const results = await Posts.findById({
                where: { postId: postId },
                attributes: ['commentId', 'nickname', 'content', 'createdAt']
            })
            res.json({ data: results })
        } catch {
            res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' })
        }
    });

router.route('/comments/:_postId')
    //댓글 생성
    .post(authMiddleware, async (req, res) => {
        try {
            const postId = req.params._postId
            try {
                const {userId} = res.locals.user
                const { nickname, password, content } = req.body
                await Comments.create({ nickname, content, userId, password })
                return res.status(200).json({ message: '댓글을 생성하였습니다.' })
            } catch {
                return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
            }
        } catch {
            return res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' })
        }
    })

router.route('/comments/:_commentId')
//댓글 수정
    .put(authMiddleware, async (req, res) => {
        try {
            const {userId} = res.locals.user
            const commentId = req.params._commentId
            const comment = await Comments.findById({ where: { postId, commentId } })
            const {password, content} = req.body

            if(!comment) {
                return res.status(404).json({message: '댓글 조회에 실패하였습니다.'})
            }
            if (password === comment.password) {
                await Comments.updateOne({_id: commentId}, {$set: {content:content, userId:userId}})
                return res.status(200).json({message:'댓글을 수정하였습니다.'})
            } else {
                return res.status(404).json
            } 
        }
        catch {
            res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'})
        }
    })
//댓글 삭제
    .delete(authMiddleware, async (req,res) => {
        try {
            const {userId} = res.locals.user
            const commentId = req.params._commentId
            const comment = await Comments.findById({ where: { userId, commentId } })
            const password = req.body.password
            if (!comment) {
                return res.status(404).json({message: '댓글 조회에 실패하였습니다.'})
            }
            if (password === comment.password) {
                await Comments.deleteOne({ where: { userId, commentId } })
                return res.status(200).json({message: '댓글을 삭제하였습니다.'})
            } else {
                return res.status(404).json
            }
        } catch {
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.'})
        }
    })

module.exports = router
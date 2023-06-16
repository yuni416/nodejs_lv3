//express 기능 사용
const express = require('express');
const router = express.Router();

//schemes 불러오기
const Comments = require('../schemas/comment.js');

router.route('/:_postId')
    //댓글 목록 조회
    .get(async (req, res) => {
        try {
            const postId = req.params._postId
            const comments = await Comments.find({ "postId": postId })
            const results = comments.map((comment) => {
                return {
                    commentId: comment._id,
                    user: comment.user,
                    content: comment.content,
                    createdAt: comment.createdAt
                }
            })
            res.json({ data: results })
        } catch {
            res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' })
        }
    });

router.route('/:_postId')
    //댓글 생성
    .post(async (req, res) => {
        try {
            const postId = req.params._postId
            try {
                const { user, password, content } = req.body
                await Comments.create({ postId: postId, user, password, content })
                return res.status(200).json({ message: '댓글을 생성하였습니다.' })
            } catch {
                return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
            }
        } catch {
            return res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' })
        }
    })

router.route('/:_commentId')
//댓글 수정
    .put(async (req, res) => {
        try {
            const commentId = req.params._commentId
            const comment = await Comments.findById(commentId)
            const {password, content} = req.body

            if(!comment) {
                return res.status(404).json({message: '댓글 조회에 실패하였습니다.'})
            }
            if (password === comment.password) {
                await Comments.updateOne({_id: commentId}, {$set: {content:content} })
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
    .delete(async (req,res) => {
        try {
            const commentId = req.params._commentId
            const comment = await Comments.findById(commentId)
            const password = req.body.password
            if (!comment) {
                return res.status(404).json({message: '댓글 조회에 실패하였습니다.'})
            }
            if (password === comment.password) {
                await Comments.deleteOne({_id: commentId})
                return res.status(200).json({message: '댓글을 삭제하였습니다.'})
            } else {
                return res.status(404).json
            }
        } catch {
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.'})
        }
    })

module.exports = router
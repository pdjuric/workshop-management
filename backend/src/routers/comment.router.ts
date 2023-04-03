import express from 'express'
import { CommentController } from '../controllers/comment.controller';

const commentRouter = express.Router();

commentRouter.route('').get(
    (req, res) => {
        if (req.query.idWorkshop) return new CommentController().get_by_workshop(req, res);
        else return new CommentController().get_by_username(req, res);
    }
)

commentRouter.route('').delete((req, res) => new CommentController().delete(req, res))

commentRouter.route('').put((req, res) => new CommentController().update(req, res))

commentRouter.route('').post((req, res) => new CommentController().add(req, res))

export default commentRouter;

import express from 'express'
import { LikeController } from '../controllers/like.controller';

const likeRouter = express.Router();


likeRouter.route('').get((req, res) => new LikeController().get_workshops(req, res))

likeRouter.route('').delete((req, res) => new LikeController().delete(req, res))

likeRouter.route('').post((req, res) => new LikeController().like(req, res))


export default likeRouter;

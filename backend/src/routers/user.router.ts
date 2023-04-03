import express from 'express'
import { UserController } from "../controllers/user.controller";
import image_upload from "../image_upload";

const userRouter = express.Router();

userRouter.route('/login').post((req, res) => new UserController().login(req, res))

userRouter.route('/register').post((req, res) => new UserController().register(req, res))

userRouter.post('/upload-profile', image_upload.single("img"), (req, res, next) => new UserController().upload_profile(req, res));

userRouter.route('/edit-profile').post((req, res) => new UserController().edit_profile(req, res));

userRouter.route('/update').post((req, res) => new UserController().update(req, res));

userRouter.route('/pending').get((req, res) => new UserController().get_pending(req, res));

userRouter.route('/active').get((req, res) => new UserController().get_active(req, res));

userRouter.route('/status').put((req, res) => new UserController().set_status(req, res));

userRouter.route('/').get((req, res) => new UserController().find(req, res));

userRouter.route('/').delete((req, res) => new UserController().delete(req, res));

userRouter.route('/password-reset').post((req, res) => new UserController().request_password_reset(req, res));

userRouter.route('/change-password').post((req, res) => new UserController().change_password(req, res));

export default userRouter;

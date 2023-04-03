import express from 'express'
import { WorkshopController } from "../controllers/workshop.controller";
import image_upload from '../image_upload';

const workshopRouter = express.Router();

workshopRouter.route('/active').get((req, res) => new WorkshopController().get_active(req, res))

workshopRouter.route('').delete((req, res) => new WorkshopController().cancel(req, res))

workshopRouter.route('/top').get((req, res) => new WorkshopController().get_top(req, res))

workshopRouter.post('/add', image_upload.single("main_image"), (req, res, next)  => new WorkshopController().add(req, res))

workshopRouter.post('/upload-gallery', image_upload.array("gallery", 5), (req, res, next)  => new WorkshopController().upload_gallery(req, res))

workshopRouter.route('/details').get((req, res) => new WorkshopController().get_details(req, res))

workshopRouter.route('/organizer').get((req, res) => new WorkshopController().get_by_organizer(req, res))

workshopRouter.route('/template').get((req, res) => new WorkshopController().get_template(req, res))

workshopRouter.route('/edit').get((req, res) => new WorkshopController().get_edit(req, res))

workshopRouter.post('/edit', image_upload.single("main_image"), (req, res, next)  => new WorkshopController().edit(req, res))

workshopRouter.post('/edit-gallery', image_upload.single("img"), (req, res, next)  => new WorkshopController().edit_gallery(req, res))

workshopRouter.route('/pending').get((req, res) => new WorkshopController().get_pending(req, res))

workshopRouter.route('/accept').get((req, res) => new WorkshopController().accept(req, res))

workshopRouter.route('/reject').get((req, res) => new WorkshopController().reject(req, res))


export default workshopRouter;

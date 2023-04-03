import express from 'express'
import { AttendanceController } from '../controllers/attendance.controller';

const attendanceRouter = express.Router();

attendanceRouter.route('/').delete((req, res) => new AttendanceController().cancel(req, res))

attendanceRouter.route('/').post((req, res) => new AttendanceController().reserve(req, res))

attendanceRouter.route('/future').get((req, res) => new AttendanceController().get_future_by_user(req, res))

attendanceRouter.route('/past').get((req, res) => new AttendanceController().get_past_by_user(req, res))

attendanceRouter.route('/requests').get((req, res) => new AttendanceController().get_requests(req, res))

attendanceRouter.route('/accept').get((req, res) => new AttendanceController().accept(req, res))

attendanceRouter.route('/reject').get((req, res) => new AttendanceController().reject(req, res))

attendanceRouter.route('/subscribe').post((req, res) => new AttendanceController().subscribe(req, res))

export default attendanceRouter;

import cors from 'cors';
import express from 'express';
import attendanceRouter from './routers/attendance.router';
import commentRouter from './routers/comment.router';
import likeRouter from './routers/like.router';
import messageRouter from './routers/message.router';
import userRouter from './routers/user.router';
import * as console from 'console';
import workshopRouter from './routers/workshop.router';
import config from './../config.json'

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql');

let pool = mysql.createPool(config.db)

pool.on('connection', function(connection) {
    connection.on('enqueue', function(sequence) {
        if ('Query' === sequence.constructor.name) {
            console.log(sequence.sql);
        }
    });
});

const router = express.Router();
router.use('/user', userRouter);
router.use('/workshop', workshopRouter);
router.use('/like', likeRouter);
router.use('/attendance', attendanceRouter);
router.use('/comment', commentRouter);
router.use('/message', messageRouter);

app.use('/image', express.static(config.uploads_folder));
app.use('/', router);
app.listen(config.port, () => console.log(`Express server running on port ${config.port}`));

export default pool;


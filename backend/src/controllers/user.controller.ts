import express from 'express'
import { asyncQuery, sendMail, randomInt } from '../utils';

export class UserController {
    login = async (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        let isAdmin = req.body.admin;

        let sql = `select * from User where username=? and user_type ${isAdmin ? '' : '!'}= 'admin' and password= ? or ( temp_password = ? and temp_dateTime >= now() );`;
        let sqlArgs = [
            username,
            password,
            password
        ]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;


        if (response.result?.status == 'pending') return res.json({pending: true})
        if (response.result?.status == 'declined') return res.json({declined: true})
        else res.json({user: response.result})
    }


    register = async (req: express.Request, res: express.Response) => {
        let user_data = req.body;

        let role = user_data.isOrganizer ? 'organizer' : 'participant';

        let sql = `insert into User values (?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?, ?,?, ?, ?, NULL, NULL)`;
        let sqlArgs = [
            user_data.first_name,
            user_data.last_name,
            user_data.username,
            user_data.password,
            user_data.telephone,
            user_data.email,
            user_data.byAdmin ? 'active' : 'pending',
            role,
            user_data.org_name,
            user_data.org_country,
            user_data.org_city,
            user_data.org_street,
            user_data.org_number,
            user_data.org_rn
        ] ;

        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) {
            if (response.error['errno'] != 1062) return res.json({error: response.error})

            let msg: string = response.error['sqlMessage'];
            if (msg.includes('user.PRIMARY')) return res.json({duplicateUsername: true});
            else return res.json({duplicateEmail: true});
        }

        return res.json({ok: response.result});
    }

    upload_profile = async (req, res) => {
        let username = req.body.username;
        let filename = req.file.filename;

        let sql = `update User set image = ? where username = ?`;
        let sqlArgs = [filename, username]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        return res.json({img: filename});
    }


    edit_profile = async (req, res) => {
        let user_data = req.body.new_data;
        let username = req.body.username;

        let sql = `update User set first_name=?,  last_name= ?, username= ?, telephone= ?, email= ?, org_name= ?,` +
            ` org_country= ?, org_city= ?, org_street= ?, org_number= ?, org_rn= ? where username= ?;`;
        let sqlArgs = [
            user_data.first_name,
            user_data.last_name,
            user_data.username,
            user_data.telephone,
            user_data.email,
            user_data.org_name,
            user_data.org_country,
            user_data.org_city,
            user_data.org_street,
            user_data.org_number,
            user_data.org_rn,
            username
        ]

        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) {
            let errData = {error: response.error}
            if (response.error.sqlMessage.includes("user.email_UNIQUE"))
                errData['duplicateEmail'] = true;
            if (response.error.sqlMessage.includes("user.PRIMARY"))
                errData['duplicateUsername'] = true;

            return res.json(errData);
        }

        res.json({ok: true});
    }

    update = async (req, res) => {
        let user_data = req.body.new_data;
        let username = req.body.username;

        let sql = `update User set first_name=?,  last_name= ?, username= ?, telephone= ?, email= ?, user_type = ?, org_name= ?,` +
            ` org_country= ?, org_city= ?, org_street= ?, org_number= ?, org_rn= ? where username= ?;`;
        let sqlArgs = [
            user_data.first_name,
            user_data.last_name,
            user_data.username,
            user_data.telephone,
            user_data.email,
            user_data.isOrganizer ? 'organizer' : 'participant',
            user_data.org_name,
            user_data.org_country,
            user_data.org_city,
            user_data.org_street,
            user_data.org_number,
            user_data.org_rn,
            username
        ]

        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) {
            let errData = {error: response.error}
            if (response.error.sqlMessage.includes("user.email_UNIQUE"))
                errData['duplicateEmail'] = true;
            if (response.error.sqlMessage.includes("user.PRIMARY"))
                errData['duplicateUsername'] = true;

            return res.json(errData);
        }

        res.json({ok: true});
    }

    get_pending = async (req, res) => {
        let sql = `select * from User where status = 'pending' and user_type != 'admin';`;

        let response = await asyncQuery(sql);
        if (response.error) return;

        res.json(response.results);
    }

    get_active = async (req, res) => {
        let sql = `select * from User where status = 'active' and user_type != 'admin';`;

        let response = await asyncQuery(sql);
        if (response.error) return;

        res.json(response.results);
    }

    set_status = async (req, res) => {
        let username = req.body.username;
        let status = req.body.status;
        let sql = `update User set status = ? where username = ?;`;
        let sqlArgs = [status, username]

        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        res.json({ok: true});
    }


    find = async (req, res) => {
        let username = req.query.username;
        let sql = `select * from User where username = ?;`;
        let sqlArgs = [username]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        let user = response.result;

        delete user.password;
        user.isOrganizer = user.user_type == 'organizer';

        res.json(user);
    }

    delete = async (req, res) => {
        let username = req.query.username;
        let sql, sqlArgs
        let response;

        sql = `update Workshop set like_count = like_count - 1 where idWorkshop in (select idWorkshop from WorkshopLikes where username = ? ); `
        sqlArgs = [username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        sql = `select idWorkshop from WorkshopAttending where username=? and confirmed=1 and dateTime > now();`
        sqlArgs = [username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        let workshops = response.results.map(t => t.idWorkshop)

        sql = `select idWorkshop from Workshop where organizer=? and dateTime > now();`
        sqlArgs = [username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        let organizedWorkshops = response.results.map(t => t.idWorkshop)

        sql = `update Workshop set spots_left=spots_left+1 where idWorkshop in (select idWorkshop from WorkshopAttending where username = ? and confirmed=1);`
        sqlArgs = [username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;




        for (let idWorkshop of organizedWorkshops) {
            let sql = `select * from Workshop where idWorkshop=${idWorkshop}`;
            let response = await asyncQuery(sql);
            if (response.error) return;

            let name = response.result.name;
            //send mail to everyone
            sql = `select email from User join WorkshopAttending using(username) where idWorkshop=${idWorkshop}`
            response = await asyncQuery(sql);
            if (response.error) return;

            for (let t of response.results)
                sendMail(t.email, 'Workshop cancelled', `Workshop "${name}" is cancelled.`)

        }

        // send mail for each workshop - there is a spot
        for (let idWorkshop of workshops) {
            sql = `select name from Workshop where idWorkshop = ?;`;
            sqlArgs = [idWorkshop]
            response = await asyncQuery(sql, sqlArgs);
            if (response.error) return;

            let name = response.result.name;
            sql = `select email from User join Subscription using (username) where idWorkshop = ?; `
            sqlArgs = [idWorkshop]
            response = await asyncQuery(sql, sqlArgs);
            if (response.error) return;

            let mails = response.results

            sql = `delete from Subscription where idWorkshop = ?; `
            sqlArgs = [idWorkshop]
            response = await asyncQuery(sql, sqlArgs);

            if (response.error) return;

            for (let t of mails)
                sendMail(t.email, 'Spot available!', `Workshop "${name}" has a spot available!`)

        }

        sql = `delete from User where username = ?;`
        sqlArgs = [username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        res.json(null);
    }

    request_password_reset = async (req, res) => {
        res.json({ok: true})
        let email = req.body.email;
        let sql = `select username from User where email = ?;`;
        let sqlArgs = [email]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error || response.result == null) return;

        let newPassword = '';
        let length = randomInt(9) + 8;

        let numberIdx = randomInt(length);
        let specialIdx = randomInt(length - 1);
        if (specialIdx >= numberIdx) specialIdx++;
        let upperIdx = randomInt(length-2);
        if (upperIdx >= numberIdx) upperIdx++;
        if (upperIdx >= specialIdx) upperIdx++;


        for (let idx = 0; idx < length; idx++)
            newPassword = newPassword.concat(String.fromCharCode(randomInt(26) + 97))

        let specials = "!\"#$%&'()*+_./:;<=>?@\\[]^_{|}~"
        newPassword = newPassword.substring(0, numberIdx) + String.fromCharCode(randomInt(10) + 48) + newPassword.substring(numberIdx + 1);
        newPassword = newPassword.substring(0, specialIdx) + specials[randomInt(specials.length)] + newPassword.substring(specialIdx + 1);
        newPassword = newPassword.substring(0, upperIdx) + newPassword.charAt(upperIdx).toUpperCase() + newPassword.substring(upperIdx + 1);

        sql = `update User set temp_password = ?, temp_dateTime = now() + INTERVAL 30 MINUTE where username = ?;`
        sqlArgs = [newPassword, response.result.username]
        response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;

        // SEND EMAIL
        sendMail(email, 'Reset password', newPassword)

    }

    change_password = async (req, res) => {
        let username = req.body.username;
        let password = req.body.password

        let sql = `update User set password = ?, temp_dateTime = NULL where username = ?;`
        let sqlArgs = [password, username]
        let response = await asyncQuery(sql, sqlArgs);
        if (response.error) return;
        res.json(true)
    }

}

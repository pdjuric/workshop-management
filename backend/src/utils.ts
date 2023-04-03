import console from 'console';
import pool from './server';
import config from './../config.json'

export class QueryResponse {
    constructor(error, results) {
        this.results = results;
        this.error = error;
    }
    results: any;
    error: any;

    get result() {
        if (this.results == null) return null
        if (Array.isArray(this.results)) return this.results[0];
        else return this.results;
    }
}

export async function asyncQuery(sql, sqlArgs = []) {
    return new Promise<QueryResponse>((resolve, reject) =>
        pool.query(sql, sqlArgs,  (e, r) => {
                if (e) console.log(e)
                resolve(new QueryResponse(e, r));
            }
        )
    )
}

export function now() : string {
    return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

export function in12hrs() : string {
    let now = new Date()
    now.setHours(now.getHours() + 12);
    return now.toISOString().slice(0, 19).replace('T', ' ');
}

export function randomInt(exclusiveMax: number) {
    return Math.floor(Math.random() * exclusiveMax);
}


let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport(config.mail);

export function sendMail(destination: string, subject: string, body: string) {
    let mail = {
        from: config.mail.auth.user,
        to: destination,
        subject: subject,
        text: body
    }

    transporter.sendMail(mail , function(error, info){
        if (error) console.log(error);
        console.log('sent mail: ' + mail)
    });

}


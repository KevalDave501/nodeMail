const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
// const cron = require('node-cron');
const cron = require('cron').CronJob;
const mysql = require('mysql');

const PORT = process.env.PORT || 8000

app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log("Server Started : "+ PORT)
});

let countEmail = 0;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'store' 
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587, 
    secure: false, 
    auth: {
        user: 'kevalsdave@gmail.com',
        pass: 'cgfr uynn thsa tbwq' 
    }
});

function sendEmail() {
    countEmail++;
    console.log("Function Start")
    let mailOptions = {
        from: 'kevalsdave@gmail.com',
        to: 'kdave.netclues@gmail.com',
        subject: 'Test Email',
        text: 'This is a scheduled email with attachment sent from Node.js using cron jobs. Email Count: '+ countEmail,
        // attachments: [
        //     {
        //         filename: 'my.jpg',
        //         path: 'my.jpg',
        //         contentType: 'image/jpeg',
        //     }
            
        // ]
    };

    console.log("check")
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Scheduled email with attachments sent: %s', info.messageId);
            // Insert email count and ID into database
            connection.query('INSERT INTO emailcounter (counter) VALUES (?)', [countEmail], (err, result) => {
                if (err) {
                    console.error('Error inserting into database:', err);
                } else {
                    console.log('Email sending data inserted into database',result);
                }
            });
        }
    });
}

// har 10 seconds ma mail jase.. :-)
const job = new cron('*/10 * * * * *', () => {
    console.log('Sending scheduled email...');
    sendEmail();
});

console.log('Email scheduler started...');
job.start();
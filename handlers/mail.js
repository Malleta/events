let fs = require('fs');
let ejs = require('ejs');
const nodemailer = require('nodemailer');

let  no_reply = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dedamraz0204@gmail.com',
        pass: 'dedamraz1234'
    }
});



let email = (function () {

    let send = function (conf) {
        let template = fs.readFileSync(`../views/emailTemplates/${conf.templateName}.ejs`, 'utf-8');

        let compiledTemplate = ejs.render(template, conf.templateVariables);

        let mailOptions = {
            from: `Events <${conf.from}>`, // sender address
            to: conf.to, // list of receivers
            subject: conf.subject, // Subject line
            html: compiledTemplate
        };

        no_reply.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    };

    return {
        send: send
    };
})();

module.exports = email;
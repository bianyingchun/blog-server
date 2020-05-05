const config = require('../config');
const nodemailer = require('nodemailer');
let clientIsValid = false;
const transporter = nodemailer.createTransport({
    service: config.EMAIL.SERVICE,
    secure: true,
    secureConnection: true,
    port: 465,
    auth: {
        user: config.EMAIL.ACCOUNT,
        pass: config.EMAIL.PASSWORD
    }
});

// 这个是后台验证是否授权成功，一般用于后台链接测试，实际项目中，不需要写
const verifyClient = () => {
    transporter.verify((error, success) => {
        if (error) {
            clientIsValid = false;
            console.log('邮件客户端初始化连接失败，请检查代码');
            // throw new Error('邮件客户端初始化连接失败，请检查代码');
        } else {
            clientIsValid = true;
            console.log('邮件客户端初始化连接成功，随时可发送邮件');
        }
    });
};

verifyClient();

const sendMail = (mailOption) => {
    if (!clientIsValid) {
        console.warn('由于未初始化成功，邮件客户端发送被拒绝');
        return false;
    }
    mailOption.from = '"Daisy" <bianyc7@163.com>';
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            console.log('邮件发送失败', error);
            // throw new Error('邮件发送失败', error);
        } else {
            console.log('Message sent: %s', info.messageId);
        }
    });
};


module.exports = {
    sendMail,
    nodemailer,
    transporter
};
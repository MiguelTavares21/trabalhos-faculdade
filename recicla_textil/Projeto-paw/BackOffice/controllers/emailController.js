const Funcionario = require('../models/funcionarioModel');
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: "reciclaTextil", key: process.env.MAILGUN_API_KEY})

const sendEmail = async (emailInfo) => {
    try {
        const Funcionarios = await Funcionario.find();
        Funcionarios.forEach(async (funcionario) => {
            if (funcionario.role === "admin" && funcionario.getsEmails) {
                const emailOptions = {
                    from: '"Recicla Têxtil" <reciclaTextil@gmail.com>',
                    to: funcionario.email,
                    subject: emailInfo.subject,
                    html: emailInfo.text
                };
                await mg.messages.create(process.env.MAILGUN_DOMAIN, emailOptions);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).render("error", {
            message: "Ocorreu um erro ao enviar email",
            error: err,
        });
    }
}

module.exports = {
    sendEmail
};

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

// function to send email
const sendEmail = async(to, subject, htmlContent) => {
    try{
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email Sent: ', info.messageId);
        return {success: true, message: "Email sent successfully!"};
    }catch(error){
        console.error("Error sending email: ", error);
        return { success: false, message: "Failed to send email." };
    }
}


module.exports = sendEmail;
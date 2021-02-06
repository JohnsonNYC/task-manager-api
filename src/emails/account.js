const sgMail = require('@sendgrid/mail')
 
sgMail.setApiKey(process.env.SENDGRID_API_KEY) 

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to:email,
    from: 'jkow95@gmail.com',
    subject: "Welcome to the App",
    text: `Welcome to the app,${name}!`
  })
}

const sendGoodbyeEmail = (email, name) =>{
  sgMail.send({
    to: email,
    from: 'jkow95@gmail.com',
    subject: "Sorry to see you go",
    text: `Sorry to see you leave, ${name}`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}
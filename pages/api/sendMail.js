import nodemailer from 'nodemailer'
import unirest from 'unirest'

const getEmailTemplate = ({ name, subject, email, message }) => ({
  sender: email,
  from: `From ${name} <${email}>`,
  to: `Me ${process.env.NODEMAILER_EMAIL}`,
  replyTo: email,
  subject: subject,
  text: message,
  html: `<p>${message}</p>
           <p>Infinity Editor</p>`
})

const handleSendEmail = async (req, res) => {
  const { email, name, subject, message, captcha } = JSON.parse(req.body)

  const {body: captchaValidation} = await unirest.post('https://www.google.com/recaptcha/api/siteverify')
    .field('secret', process.env.RECAPTCHA_SECRET)
    .field('response', captcha)

  const captchaSucceeded = captchaValidation.success

  if (!captchaSucceeded) {
    const errors = captchaValidation['error-codes']
    return res.status().send({ msg: errors, success: false })
  }

  if (!email) return res.status(400).send({ msg: 'Invalid entries', success: false })

  const toSend = {
    sender: email,
    from: `From Infinity Editor <${email}>`,
    to: `Me ${process.env.NODEMAILER_EMAIL}`,
    replyTo: email,
    subject: subject,
    text: message,
    html: `<p>From ${name},</p>
                <p>${message}</p>
               <p>Infinity Editor</p>`
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
  })

  transporter.sendMail(toSend, (err, info) => {
    if (err) return res.status(500).json({ msg: err.message, success: false })

    return res.status(200).json({ msg: 'Email sent', success: true })
  })

}

export default handleSendEmail
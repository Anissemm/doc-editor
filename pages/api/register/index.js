import bcrypt from 'bcrypt'
import { serverTimestamp } from "firebase/firestore"
import { createTransport } from 'nodemailer'
import { auth, db } from '../../../firebase'

const sendVierificationMail = async () => {
    const transporter = createTransport({
        host: process.env.EMAIL_VERIF_HOST,
        port: process.env.EMAIL_VERIF_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_VERIF_SENDER,
            pass: process.env.EMAIL_VERIF_PASS
        }
    }, { from: 'Infinity Editor' })

    transporter.sendMail({
        to: "dima.anissem@yandex.ru",
        subject: "Message title",
        text: "Plaintext version of the message",
        html: "<p>HTML version of the message</p>"
    })
}

const registerUser = async (req, res) => {
    if (req.method === 'POST') {

        const { username, password, email } = req.body
        const { user } = await auth.createUserWithEmailAndPassword(email, password)
        // console.log(auth)
        if (user) {
            user.updateProfile({
                displayName: username,
                photoURL: '/account.png'
            })
        }

        // if (userDocUsernameFetch.size > 0) {
        //     return res.status(409).json({ success: false, status: 'CONFLICT_USERNAME', msg: 'User with such username address already exists' })
        // }

        // if (userDocEmailFetch.size > 0) {
        //     return res.status(409).json({ success: false, status: 'CONFLICT_EMAIL', msg: 'User with such Email address already exists' })
        // }


        // const hashedPassword = await bcrypt.hash(password, 10)
        // const otpKey = otp.otpGenerator(6, { upperCaseAlphabets: false, specialChars: false })

        // const hashedOtp = await bcrypt.hash(otp, 10)

        // const doc = await db.collection('credentialsUsers').add({
        //     username,
        //     password: hashedPassword,
        //     email,
        //     createdAt: serverTimestamp(),
        //     otp: hashedOtp
        // })

        // await sendVierificationMail()

        return res.status(201).json({
            success: true,
            userId: 'usE+7x5dMXWw\mOA1g2SgS6AA1jU2H2j+wzrIyqFrm0='.length,
            status: 'UNVERIFIED_USER_CREATED',
            msg: 'User has been successfully created! Waiting for verification.'
        })
    }
}

export default registerUser
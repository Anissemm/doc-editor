import { auth } from '../../../firebase'

const verifyEmail = async (req, res) => {
    try {
        const { oobCode } = req.query
        await auth.applyActionCode(oobCode)
        return res.redirect(`/?verificationComplete=true`)

    } catch (err) {
        console.log(err)
        return res.redirect(`/?verificationComplete=false&error=${encodeURI(err.code)}`)
    }
}

export default verifyEmail
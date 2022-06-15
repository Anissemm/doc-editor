import { auth } from '../../firebase'

const verifyEmail = async (req, res) => {
    const { mode, oobCode } = req.query
    try {
        if (mode === 'verifyEmail') {
            await auth.applyActionCode(oobCode)
            return res.redirect(`/?mode=verifyEmail&verificationComplete=true`)
        }

        if (mode === 'resetPassword') {
            return res.redirect(`/?mode=resetPassword&verificationComplete=false&oobCode=${oobCode}`)
        }

    } catch (err) {
        return res.redirect(`/?mode=${mode}&verificationComplete=false&error=${err.code}`)
    }
}

export default verifyEmail
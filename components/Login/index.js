import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import Logo from "../Logo"
import dynamic from "next/dynamic"
import { useDocumentScrollDimensions } from "../../hooks/useWindowDimensions"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { auth } from "../../firebase"
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils"
import Head from "next/head"

const Switch = dynamic(() => import("./Switch"), { ssr: false })
const SignInForm = dynamic(() => import("./SignInForm"), { ssr: false })
const SignUpForm = dynamic(() => import("./SignUpForm"), { ssr: false })
const EmailVerificationComplete = dynamic(() => import("./EmailVerificationComplete"), { ssr: false })
const EmailVerificationSent = dynamic(() => import("./EmailVerificationSent"), { ssr: false })
const EmailVerificationResent = dynamic(() => import("./EmailVerificationResent"), { ssr: false })
const ResetPassword = dynamic(() => import("./PasswordReset"), { ssr: false })
const SignInOutError = dynamic(() => import("./SignInOutError"), { ssr: false })
const ContactMeModal = dynamic(() => import("../ContactMeModal"), { ssr: false })

const useVerifComplete = () => {
    const router = useRouter()
    const { query } = router
    const error = query?.error ? query.error : ''

    return { mode: query.mode, status: query.verificationComplete, error, oobCode: query?.oobCode }
}

const Login = ({ isNotEmailVerified }) => {
    const { mode, status, oobCode } = useVerifComplete()
    const { scrollHeight } = useDocumentScrollDimensions()

    const [form, setForm] = useState('signin')
    const [sHeight, setSHeight] = useState('')
    const [email, setEmail] = useState('')
    const [signInOutError, setSignInOutError] = useState(null)
    const [confirmResetPassword, setConfirmResetPassword] = useState({ oobCode: null, status: false, msg: 'pending_confirmation' })

    const title = form === 'signup' ? 'Sign Up' :
        form === 'verification-complete' || form === 'verification-mail-sent' ? 'Email Verification' :
            form === 'reset-password' ? 'Password Reset' :
                'Sign In'

    useEffect(() => {
        if (status === 'true' && mode === 'verifyEmail') {
            setForm('verification-complete')
        }
        if (mode === 'resetPassword' && oobCode) {
            setConfirmResetPassword({ oobCode, status: false, msg: 'confirming' })
            setForm('reset-password')
        }
    }, [status])

    useEffect(() => {
        setSHeight(scrollHeight)
    }, [])

    return (
        <>
            <Head>
                <title>{title} | Infinity Editor</title>
            </Head>
            <AnimatePresence >
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`relative font-[Poppins] py-14 pb-24 sm:py-24 sm:p-0 sm:grid sm:grid-cols-2 bg-zinc-900  min-h-screen h-${sHeight} sm:grid-rows-1`}>
                    <motion.div className="login-page mb-4 xs:!mb-10 sm:!my-0 font-semibold text-gray-500 flex items-center justify-center">
                        <Logo loginPage={true} srOnly={false} width={270} height={135} scrollHeight={sHeight} form={form} />
                    </motion.div>
                    <div>
                        <LayoutGroup inherit>
                            {isNotEmailVerified ? <EmailVerificationResent /> :
                                <>
                                    <Switch setForm={setForm} form={form} />
                                    {signInOutError && <SignInOutError error={signInOutError} setError={setSignInOutError} />}
                                    {form === 'signup' && <SignUpForm setForm={setForm} setEmail={setEmail} setError={setSignInOutError} />}
                                    {form === 'signin' && <SignInForm setForm={setForm} setError={setSignInOutError} />}
                                    {form === 'verification-complete' && <EmailVerificationComplete setForm={setForm} />}
                                    {form === 'verification-mail-sent' && <EmailVerificationSent setForm={setForm} email={email} />}
                                    {form === 'reset-password' && <ResetPassword setForm={setForm} confirm={confirmResetPassword} setConfirm={setConfirmResetPassword} />}
                                </>
                            }
                        </LayoutGroup>
                    </div>
                    <footer className="absolute bottom-5 left-5 text-xs text-gray-300 italic font-light">
                        Created by Anis "Anissem" Dimassi
                        <a className="hover:underline" href="https://github.com/Anissemm" target='_blank' rel="noreferrer" alt="My Github"><br />https://github.com/Anissemm</a>
                        {/* <a className="hover:underline" href="mailto:dima.anissem@gmail.com" alt="Mail me"><br />dima.anissem@gmail.com</a> */}
                    </footer>
                </motion.div>
            </AnimatePresence>
            <ContactMeModal />
        </>
    )

}

export const customSignOut = async (session, redirect = false, callbackUrl) => {
    try {
        await signOut({ redirect, callbackUrl })
        if (session?.user?.isCredentials) {
            await auth.signOut()
        }
    } catch (error) {
        console.log(error)
    }
}

export default Login
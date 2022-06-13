import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import Logo from "../Logo"
import dynamic from "next/dynamic"
import { useDocumentScrollDimensions } from "../../hooks/useWindowDimensions"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

const Switch = dynamic(() => import("./Switch"), { ssr: false })
const SignInForm = dynamic(() => import("./SignInForm"), { ssr: false })
const SignUpForm = dynamic(() => import("./SignUpForm"), { ssr: false })
const EmailVerificationComplete = dynamic(() => import("./EmailVerificationComplete"), { ssr: false })
const EmailVerificationSent = dynamic(() => import("./EmailVerificationSent"), { ssr: false })
const ResetPassword = dynamic(() => import("./PasswordReset"), { ssr: false })

const useEmailVerifComplete = () => {
    const router = useRouter()
    const { query } = router
    const error = query?.error ? query.error : ''

    return [query.verificationComplete, error]
}

const Login = () => {
    const [status] = useEmailVerifComplete()

    const { scrollHeight } = useDocumentScrollDimensions()
    const [form, setForm] = useState('signin')
    const [sHeight, setSHeight] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (status === 'true') {
            setForm('verification-complete')
        }
    }, [status])

    useEffect(() => {
        setSHeight(scrollHeight)
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`font-['Poppins'] py-24 sm:p-0 sm:grid sm:grid-cols-2 bg-zinc-900  min-h-screen h-${sHeight} sm:grid-rows-1`}>
            <motion.div className="login-page font-['Poppins'] my-10 sm:my-0 text-3xl lg:text-5xl font-semibold text-gray-500 flex items-center justify-center">
                <Logo loginPage={true} srOnly={false} width={270} height={135} scrollHeight={sHeight} form={form} />
            </motion.div>
            <div>
                <AnimatePresence >
                    <LayoutGroup inherit>
                        {(form === 'signup' || form === 'signin') && <Switch setForm={setForm} form={form} />}
                        {form === 'signup' && <SignUpForm setForm={setForm} setEmail={setEmail} />}
                        {form === 'signin' && <SignInForm setForm={setForm} />}
                        {form === 'verification-complete' && <EmailVerificationComplete setForm={setForm} />}
                        {form === 'verification-mail-sent' && <EmailVerificationSent setForm={setForm} email={email} />}
                        {form === 'reset-password' && <ResetPassword setForm={setForm} />}
                    </LayoutGroup>
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default Login
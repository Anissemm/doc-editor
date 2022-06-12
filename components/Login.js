import { motion } from "framer-motion"
import Button from "@material-tailwind/react/Button"
import { signIn } from "next-auth/react"
import GoogleSvg from '../public/svg/google'
import YandexSvg from '../public/svg/yandex'
import Logo from "./Logo"
import SingUpForm from "./SingUpForm"

const MotionButton = motion(Button)

const variants = {
    hidden: {
        opacity: 0,
        y: 100
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1
        }
    },
}

const iconVariants = {
    hidden: {
        opacity: 0,
        rotateZ: 0
    },
    visible: {
        opacity: 1,
        rotateZ: 45,
        transition: {
            duration: 1,
            delay: 0.5
        }
    }
}
const loginVariants = {
    hidden: i => ({
        opacity: 0,
        translateY: i === 0 ? 100 : 0
    }),
    visible: i => ({
        opacity: 1,
        translateY: 0,
        transition: {
            duration: 1,
            delay: 0.5 * i
        }
    })
}

const Login = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 sm:p-0 sm:grid sm:grid-cols-2 bg-zinc-900 sm:h-auto h-screen sm:grid-rows-1">
            <motion.div initial='hidden' animate='visible' className="login-page font-['Poppins'] my-10 sm:my-0 text-3xl lg:text-5xl font-semibold text-gray-500 flex items-center justify-center">
                <Logo loginPage={true} srOnly={false} width={270} height={135}/>
            </motion.div>
            <motion.div initial='hidden' animate='visible' className="z-1 relative font-['Poppins'] my-10 sm:my-0 lg:text-5xl font-semibold flex flex-col justify-center items-center text-gray-400">
                <h2 className="sr-only" variants={loginVariants} custom={0}>Sign in</h2>
                <SingUpForm />
                <MotionButton
                    variants={loginVariants}
                    custom={1}
                    color='blueGray'
                    buttonType="filled"
                    size="md"
                    rounded={false}
                    iconOnly={false}
                    ripple="light"
                    className='mt-3 bg-gray-700 shadow-sm'
                    aria-label='Sing in with Google'
                    onClick={() => { signIn('google') }}
                >
                    Sign in with
                    <GoogleSvg className="w-24 h-9" />
                </MotionButton>
                <MotionButton
                    variants={loginVariants}
                    custom={2}
                    color='blueGray'
                    buttonType="filled"
                    size="md"
                    rounded={false}
                    iconOnly={false}
                    ripple="light"
                    className='mt-3 bg-gray-700 shadow-sm'
                    aria-label='Sing in with Yandex'
                    onClick={() => { signIn('yandex') }}
                >
                    Sign in with
                    <YandexSvg className="w-24 h-9" />
                </MotionButton>
            </motion.div>
        </motion.div>
    )
}

export default Login
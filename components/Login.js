import { motion } from "framer-motion"
import Button from "@material-tailwind/react/Button"
import { signIn } from "next-auth/react"
import GoogleSvg from '../assets/svg/google'

const MotionButton = motion(Button)
console.log(GoogleSvg)
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

const Login = ({ transition }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 sm:p-0 sm:grid sm:grid-cols-2 bg-zinc-900 sm:h-auto h-screen sm:grid-rows-1">
            <motion.div initial='hidden' animate='visible' className="font-['Poppins'] my-10 sm:my-0 text-3xl lg:text-5xl font-semibold text-gray-500 flex items-center justify-center">
                <motion.h1 className="relative z-1 md:text-4xl lg:text-5xl" variants={variants}>The Editor</motion.h1>
                <motion.span variants={iconVariants} class="material-icons pl-2 lg:pl-5 md:text-4xl lg:text-8xl gray-500">description</motion.span>
            </motion.div>
            <motion.div initial='hidden' animate='visible' className="font-['Poppins'] my-10 sm:my-0 lg:text-5xl font-semibold flex flex-col justify-center items-center text-gray-400">
                <h2 className="sr-only" variants={loginVariants} custom={0}>Sign in</h2>
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
            </motion.div>
        </motion.div>
    )
}

export default Login
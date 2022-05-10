import { motion } from "framer-motion"
import Button from "@material-tailwind/react/Button"
import Icon from "@material-tailwind/react/Icon"
import { ReactComponent as Google } from '../assets/google.svg'

const MotionButton = motion(Button)

const variants = {
    hidden: {
        opacity: 0,
        y: 100
    },
    visible: {
        opacity: 1,
        y: 0,
        transiton: {
            duration: 0.5
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
            delay: 1
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
            delay: 0.4 * i + 1
        }
    })
}

const Login = ({ transition }) => {
    return (
        <div className="md:grid md:grid-cols-2">
            <motion.div initial='hidden' animate='visible' className="font-['Poppins'] bg-slate-800 text-3xl lg:text-5xl font-semibold text-gray-400 flex items-center justify-center min-h-screen">
                <motion.h1 className="relative z-1 md:text-4xl lg:text-5xl" variants={variants}>The Editor</motion.h1>
                <motion.span variants={iconVariants} class="material-icons pl-2 lg:pl-5 md:text-4xl lg:text-8xl gray-500">description</motion.span>
            </motion.div>
            <motion.div initial='hidden' animate='visible' className="font-['Poppins'] bg-slate-800 lg:text-5xl font-semibold flex flex-col justify-center items-center text-gray-400 min-h-screen">
                <motion.h2 variants={loginVariants} custom={0}>Connect with:</motion.h2>
                <MotionButton
                    variants={loginVariants} 
                    custom={2}
                    color="gray"
                    buttonType="filled"
                    size="lg"
                    rounded={false}
                    iconOnly={false}
                    ripple="light"
                >
                    Google
                </MotionButton>
            </motion.div>
        </div>
    )
}

export default Login
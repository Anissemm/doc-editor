import GlowOverflow from "../../public/svg/GlowOverflow"
import style from './logo.module.css'
import { motion } from "framer-motion"

const variants = {
    hidden: {
        opacity: 0
    },
    visible: (i) => ({
        opacity: 1,
        transition: {
            delay: i * 0.5,
            duration: 1
        }
    })
}

const Logo = ({width = 40, height = 20, loginPage = false, srOnly = true }) => {
    return (
        <motion.h1 className='flex items-center flex-col'>
            <motion.div className='relative' style={{width, height}}>
                <motion.div variants={variants} initial='hidden' animate='visible' custom={0} className={`${style.glow} ${loginPage ? style.loginPage : ''}`} />
                <motion.img variants={variants} initial='hidden' animate='visible' custom={1}  src='/image/logo.png' className='object-fit relative z-2' />
            </motion.div>
            <motion.span variants={variants} initial='hidden' animate='visible' custom={2}  className={`block z-1 relative text-5xl select-none ${srOnly ? 'sr-only' : ''}`}>Infinity</motion.span>
            {!srOnly && <motion.small variants={variants} initial='hidden' animate='visible' custom={3}  className="italic pt-1 underline decoration-2 decoration-orange-700 underline-offset-2">A Cool and Tiny Text Editor</motion.small>}
        </motion.h1>
    )
}

export default Logo
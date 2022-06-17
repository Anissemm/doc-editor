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

const Logo = ({ width = 40, height = 20, loginPage = false, srOnly = true }) => {
    return (
        <>
            {loginPage && <motion.div
                layout
                custom={0}
                className={`${style.glow} ${loginPage ? style.loginPage : ""} fixed top-0 left-auto sm:left-0 !w-[50vw] rounded-full`} />}

            <motion.h1 layout className='flex justify-center items-center flex-col' >
                <motion.div layout className='relative px-6 xs:!p-0' style={{ maxWidth: width, height }}>
                    {!loginPage && <motion.div
                        layout
                        variants={variants}
                        initial='hidden'
                        animate='visible'
                        custom={0}
                        className={`${style.glow}`} />}
                    <motion.img
                        variants={variants}
                        initial='hidden'
                        animate='visible'
                        custom={1}
                        src='/image/logo.png'
                        className={`relative flex-shrink-0 z-2 ${loginPage ? 'object-contain w-full' : 'w-[40px] -left-5 xs:!left-0 !max-w-none'}`} />
                </motion.div>
                <motion.span
                    variants={variants}
                    initial='hidden'
                    animate='visible'
                    custom={2}
                    className={`block z-1 relative -top-5 xs:!top-0 text-4xl xs:!text-5xl select-none ${srOnly ? 'sr-only' : ''}`}>Infinity</motion.span>
                {!srOnly && <motion.small
                    variants={variants}
                    initial='hidden'
                    animate='visible'
                    custom={3}
                    className="relative italic pt-1 font-light -top-5 xs:!top-0  text-lg xs:!text-xl">A Cool and Tiny Text Editor</motion.small>}
            </motion.h1>
        </>
    )
}

export default Logo
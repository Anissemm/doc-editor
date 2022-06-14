import style from './logo.module.css'
import { motion } from "framer-motion"
import { useDocumentScrollDimensions } from '../../hooks/useWindowDimensions'
import { useEffect, useState } from 'react'

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

const Logo = ({ width = 40, height = 20, loginPage = false, srOnly = true, scrollHeight = '', form }) => {
    return (
        <>
            {loginPage && <motion.div
                layout
                custom={0}
                className={`${style.glow} ${loginPage ? style.loginPage : ""} fixed top-0 left-auto sm:left-0 !w-[50vw] rounded-full`} />}

            <motion.h1 layout className='flex justify-center items-center flex-col' >
                <motion.div layout className='relative' style={{ width, height }}>
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
                        className='object-fit relative z-2' />
                </motion.div>
                <motion.span
                    variants={variants}
                    initial='hidden'
                    animate='visible'
                    custom={2}
                    className={`block z-1 relative text-5xl select-none ${srOnly ? 'sr-only' : ''}`}>Infinity</motion.span>
                {!srOnly && <motion.small
                    variants={variants}
                    initial='hidden'
                    animate='visible'
                    custom={3}
                    className="italic pt-1 font-light">A Cool and Tiny Text Editor</motion.small>}
            </motion.h1>
        </>
    )
}

export default Logo
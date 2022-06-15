import React from 'react'
import { motion } from 'framer-motion'
import style from './switch.module.css'

const Switch = ({ setForm, form }) => {
    return (
        <motion.div className='w-[220px] flex mx-auto mb-8' >
            {[{ key: 'signin', description: 'Sign In' }, { key: 'signup', description: 'Sign Up' }].map(btn => {
                return (
                    <motion.button key={btn.key} className={`${form !== btn.key ? 'text-gray-500' : 'text-white'} hover:text-gray-200 transition 
                    relative w-[50%] flex items-center justify-center pb-3  focus:outline-none `} onClick={() => { setForm(btn.key) }}>
                        <span>
                            {btn.description}
                        </span>
                        {form === btn.key && <motion.span
                            className={`${style.switchUnderline} h-1 w-full absolute bottom-0 bg-white rounded-md shadow-2xl shadow-white`}
                            layoutId='underline-signupin' />}
                    </motion.button>
                )
            })}
        </motion.div>
    )
}

export default Switch
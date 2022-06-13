import React from 'react'
import { Input, Button } from '@material-tailwind/react'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import GoogleSvg from '../../public/svg/google'
import YandexSvg from '../../public/svg/yandex'
import OrBar from './OrBar'

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

const MotionButton = motion(Button)

const SignInForm = ({ setForm }) => {
    return (
        <motion.div
            layoutId='form'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-1 relative mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
            <h2 className="sr-only" variants={loginVariants} custom={0}>Sign in</h2>
            <form className='w-[220px] !text-md'>
                <div className='mb-2.5 !text-white'>
                    <Input outline={true} color='gray' size="md" type="email" id="sign-in-mail" name="email" placeholder='Your Email' />
                </div>
                <div className='mb-2.5'>
                    <Input outline={true} color='gray' size="md" id="sign-in-password" type="text" name="password" placeholder='Your Password' />
                </div>
                <div className='mb-2.5'>
                    <button
                        onClick={() => {setForm('reset-password')}}
                        type="button"
                        className='bg-transparent text-sm border-none hover:text-gray-500 focus:text-gray-500 transition 
                            duration-200 ml-auto float-right pb-2 underline'>
                        Forgot Password?
                    </button>
                    <MotionButton
                        type="submit"
                        variants={loginVariants}
                        custom={1}
                        color='blueGray'
                        buttonType="filled"
                        size="md"
                        block={true}
                        rounded={false}
                        iconOnly={false}
                        ripple="light"
                        className='mt-3 bg-gray-700 shadow-sm'
                        aria-label='Sing in with Google'
                        onClick={(e) => { e.preventDefault() }}
                    >
                        Sign in
                    </MotionButton>
                    <p className='text-sm text-center py-4'>
                        New here?
                        <button
                            type="button"
                            onClick={() => { setForm('signup') }}
                            className='bg-transparent text-sm border-none pl-1 hover:text-gray-500 focus:text-gray-500 transition 
                            duration-200 ml-auto underline'>
                            Sign up instead.
                        </button>
                    </p>
                </div>
            </form>
            <OrBar />
            <MotionButton
                variants={loginVariants}
                custom={1}
                color='blueGray'
                buttonType="filled"
                size="sm"
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
                size="sm"
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
    )
}

export default SignInForm
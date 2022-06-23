import React, { useState } from 'react'
import Button from '@material-tailwind/react/Button'
import Input from '@material-tailwind/react/Input'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import GoogleSvg from '../../public/svg/google'
import YandexSvg from '../../public/svg/yandex'
import OrBar from './OrBar'
import GithubLogo from '../../public/svg/github'

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

const SignInForm = ({ setForm, setError }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <motion.div
            layoutId='form'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-1 relative mt-5 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
            <h2 className="sr-only" variants={loginVariants} custom={0}>Sign in</h2>

            <form
                className='w-[220px] !text-md'
                onChange={() => setError(null)}
                onSubmit={async (e) => {
                    e.preventDefault()
                    const result = await signIn('credentials', { redirect: false, email, password })

                    if (result.error) {
                        setError(result.error)
                    }

                }}>
                <div className='mb-2.5 signin-input !text-white'>
                    <Input
                        autoComplete='off'
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        id="signin-email"
                        outline={true}
                        color='gray'
                        size="md"
                        placeholder='Your Email'
                    />
                </div>
                <div className='mb-2.5 signin-input'>
                    <Input
                        autoComplete='off'
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        id="signin-password"
                        color='gray'
                        size="md"
                        outline={true}
                        placeholder='Your Password'
                    />
                </div>
                <div className='mb-2.5'>
                    <button
                        onClick={() => { setForm('reset-password') }}
                        type="button"
                        className='bg-transparent text-sm border-none hover:text-gray-500 focus:text-gray-500 transition 
                            duration-200 ml-auto float-right pb-4 underline'>
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
                className='mt-3 bg-gray-700 shadow-sm min-w-[220px]'
                aria-label='Sing in with Google'
                onClick={() => { signIn('google') }}
            >
                Sign in with
                <GoogleSvg className="w-24 h-9" />
            </MotionButton>
        </motion.div>
    )
}

export default SignInForm
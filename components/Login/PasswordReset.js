import React, { useState } from 'react'
import { Input, Button } from '@material-tailwind/react'
import { AnimatePresence, motion } from 'framer-motion'
import { auth } from '../../firebase'
import * as yup from 'yup'
import { Formik } from 'formik'

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

const ResetPassword = ({ setForm }) => {
    const [responseError, setResponseError] = useState(false)
    const [done, setDone] = useState(false)

    return (
        <AnimatePresence exitBeforeEnter>
            {!done && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-1 relative mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
                <h2 className='text-2xl' variants={loginVariants} custom={0}>Password Reset</h2>
                <p className='p-14 pb-4 font-normal'>If you've lost your password or wish to reset it, enter your email in the field below in order to finalize the process.</p>
                <Formik
                    initialValues={{ email: '' }}
                    validateOnChange
                    validationSchema={yup.object({
                        email: yup.string().email('Invalid email').required('Required')
                    })}
                    onSubmit={async (values) => {
                        try {
                            await auth.sendPasswordResetEmail(values.email)
                            setDone(true)
                        } catch (error) {
                            if (error.code == 'auth/user-not-found') {
                                setResponseError('No user with such email')
                            }
                        }
                        await auth.sendPasswordResetEmail(values.email)
                    }}
                >
                    {formik => (
                        <form onSubmit={formik.handleSubmit} className='w-[220px] !text-md py-5'>
                            <div className='signup-input mb-2.5 !text-white'>
                                <Input
                                    outline={true}
                                    color='gray'
                                    size="md"
                                    type="email"
                                    id="password-reset-mail"
                                    name='email'
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    error={(formik.touched.email && formik.errors.email) || (responseError && responseError)}
                                    placeholder='Your Email'
                                />
                            </div>
                            <div className='mb-2.5'>
                                <MotionButton
                                    type='submit'
                                    variants={loginVariants}
                                    custom={1}
                                    color='blueGray'
                                    buttonType="filled"
                                    size="md"
                                    block={true}
                                    rounded={false}
                                    ripple="light"
                                    className='mt-3 bg-gray-700 shadow-sm'
                                    aria-label='Sing in with Google'
                                >
                                    Send Mail
                                </MotionButton>
                            </div>
                        </form>
                    )}
                </Formik>
            </motion.div >}
            {done && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-1 relative mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
                <h2 className='text-2xl' variants={loginVariants} custom={0}>Password Reset</h2>
                <p className='p-14 pb-4 font-normal text-center'>If you've lost your password or wish to reset it, enter your email in the field below in order to finalize the process.</p>
                <div className='mb-2.5'>
                    <MotionButton
                        variants={loginVariants}
                        custom={1}
                        color='blueGray'
                        buttonType="filled"
                        size="md"
                        block={true}
                        rounded={false}
                        ripple="light"
                        className='mt-3 bg-gray-700 shadow-sm'
                        aria-label='Sing in with Google'
                        onClick={() => {
                            setForm('signin')
                        }}
                    >
                        Go back
                    </MotionButton>
                </div>
            </motion.div >}
        </AnimatePresence>
    )
}

export default ResetPassword
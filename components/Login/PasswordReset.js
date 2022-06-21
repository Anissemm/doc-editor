import React, { useState } from 'react'
import Button from '@material-tailwind/react/Button'
import Input from '@material-tailwind/react/Input'
import { AnimatePresence, motion } from 'framer-motion'
import { auth } from '../../firebase'
import * as yup from 'yup'
import { Formik } from 'formik'
import useClearQueryIn from '../../hooks/useClearQueryIn'
import { useRouter } from 'next/router'

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

const passwordRegex = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/

const ResetPassword = ({ setForm, confirm, setConfirm }) => {
    const router = useRouter()
    const [responseError, setResponseError] = useState(false)
    const [email, setEmail] = useState(null)
    const [emailSentDone, setEmailSentDone] = useState(false)

    const secondsLeft = useClearQueryIn(() => {
        setConfirm({ status: false, oobCode: null, msg: 'pending_confirmation' })
        setForm('signin')
    }, { clear: confirm.status })

    return (
        <AnimatePresence exitBeforeEnter>
            {!emailSentDone && !confirm.status && confirm.msg === 'pending_confirmation' && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-1 relative mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
                <h2 className='text-2xl' variants={loginVariants} custom={0}>Password Reset</h2>
                <p className='py-5 px-14 font-normal'>If you've lost your password or wish to reset it, enter your email in the field below in order to finalize the process.</p>
                <Formik
                    initialValues={{ email: '' }}
                    validateOnChange
                    validationSchema={yup.object({
                        email: yup.string().email('Invalid email').required('Required')
                    })}
                    onSubmit={async (values) => {
                        const { email } = values
                        try {
                            setEmail(email)
                            await auth.sendPasswordResetEmail(email)
                            setEmailSentDone(true)
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
                                    error={(formik.touched.email && formik.errors.email) || (responseError ? responseError : '')}
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
                                    aria-label='Send Reset Email'
                                >
                                    Send Mail
                                </MotionButton>
                            </div>
                        </form>
                    )}
                </Formik>
            </motion.div >}

            {emailSentDone && !confirm.status && confirm.msg === 'pending_confirmation' && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-1 relative mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
                <h2 className='text-2xl' variants={loginVariants} custom={0}>Password Reset</h2>
                <p className='py-5 px-14 font-normal text-center'>We've just sent you an email at<span className='font-bold'> {email} </span>
                    with instructions for resetting your password. <span className="italic"> If you don't receive this email, please check your junk folder or contact us for further assistance.</span></p>
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
                        aria-label='Go back to home'
                        onClick={() => {
                            setForm('signin')
                        }}
                    >
                        Go back
                    </MotionButton>
                </div>
            </motion.div >}

            {!confirm.status && confirm.msg === 'confirming' &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="z-1 relative font-['Poppins'] mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
                    <h2 className="pb-10" variants={loginVariants} custom={0}>Enter New Password</h2>
                    <Formik
                        initialValues={{ password: '', repeatPassword: '' }}
                        validationSchema={yup.object({
                            password: yup.string().matches(passwordRegex, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character").required('Password required'),
                            repeatPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password required')
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            const { password } = values
                            setSubmitting(true)
                            await auth.confirmPasswordReset(confirm.oobCode, password)
                            setConfirm({ status: true, oobCode: null, msg: 'password-resetted' })
                            setSubmitting(false)
                        }}
                    >
                        {formik => {
                            return (
                                <>
                                    <form className='w-[220px] !text-md' onSubmit={formik.handleSubmit}>
                                        <div className='mb-2.5 signup-input'>
                                            <Input
                                                outline={true}
                                                color='gray'
                                                size="md"
                                                id="reset-password"
                                                type="password"
                                                name="password"
                                                error={formik.touched.password && formik.errors.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                values={formik.values.password}
                                                placeholder='Password' />
                                        </div>

                                        <div className='mb-2.5 signup-input'>
                                            <Input
                                                outline={true}
                                                color='gray'
                                                size="md"
                                                id="confirm-reset-password"
                                                type="password"
                                                name="repeatPassword"
                                                error={formik.touched.repeatPassword && formik.errors.repeatPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.repeatPassword}
                                                placeholder='Confirm Password' />
                                        </div>

                                        <div className='mb-2.5 text-xs font-normal text-center px-1'>
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
                                                aria-label='Sing in with Email and Password'
                                            >
                                                Reset Password
                                            </MotionButton>
                                        </div>
                                    </form>
                                </>
                            )
                        }}
                    </Formik>
                </motion.div>}

            {confirm.status && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-1 relative mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
                <h2 className='text-2xl' variants={loginVariants} custom={0}>Password resetted!</h2>
                <p className='py-5 px-14 font-normal text-center'>
                    You will redirect automatically to home in {secondsLeft} seconds.
                </p>
                <div className='mb-2.5'>
                    <MotionButton
                        variants={loginVariants}
                        custom={1}
                        color='blueGray'
                        buttonType="filled"
                        size="md"
                        block={false}
                        rounded={false}
                        ripple="light"
                        className='mt-3 bg-gray-700 shadow-sm'
                        aria-label='Go back to home'
                        onClick={() => {
                            setForm('signin')
                            router.push('/', { shallow: true })
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
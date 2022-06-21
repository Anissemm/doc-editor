import React, { useState, useEffect, useRef } from "react"
import Modal from "@material-tailwind/react/Modal"
import ModalBody from "@material-tailwind/react/ModalBody"
import ModalFooter from "@material-tailwind/react/ModalFooter"
import Icon from "@material-tailwind/react/Icon"
import Input from "@material-tailwind/react/Input"
import Button from "@material-tailwind/react/Button"
import Textarea from "@material-tailwind/react/Textarea"
import { motion, AnimatePresence } from 'framer-motion'
import { useFormik } from "formik"
import * as yup from 'yup'
import InfinityLoader from "../public/svg/InfinityLoader"
import ReCAPTCHA from "react-google-recaptcha"
import { useSession } from "next-auth/react"

const contactFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email address').required('Email is required'),
    name: yup.string().required('Name is required'),
    subject: yup.string().required('Subject is required'),
    message: yup.string().required('Message is required')
})

export default function ContactMeModal() {
    const { data: _session, status } = useSession()
    const [show, setShow] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const recaptchaRef = useRef()

    const formik = useFormik({
        initialValues: {
            email: '',
            name: '',
            subject: '',
            message: ''
        },
        validationSchema: contactFormSchema,
        validateOnBlur: true,
        onSubmit: async (values, { setSubmitting }) => {
            let data = {...values, unauthenticated: false}
            try {
                if (status === 'unauthenticated') {
                    const captcha = await recaptchaRef.current.executeAsync()
                    data = {
                        ...data,
                        captcha,
                        unauthenticated: true
                    }
                }

                setSubmitting(true)

                const response = await fetch('/api/sendMail', {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                const msgSent = await response.json()

                if (!msgSent.success) {
                    if (Array.isArray(msgSent.msg)) {
                        throw new Error('invalid captcha')
                    }
                    throw new Error(msgSent.msg)
                }

                setSubmitting(false)
                setSent(true)

                if (status === 'unauthenticated') {
                    recaptchaRef.current.reset()
                }

            } catch (error) {
                if (error.message === 'invalid captcha') {
                    setError('Invalid Captcha!')
                    console.log(error.message)
                    return null
                } else {
                    setError(error.message)
                    console.error(error)
                }

                setSubmitting(false)

                if (status === 'unauthenticated') {
                    recaptchaRef.current.reset()
                }
            }
        }
    })

    useEffect(() => {
        if (sent) {
            const timeoutKey = setTimeout(() => {
                setShow(false)
                setSent(false)
                setError('')
                formik.resetForm()
            }, 2500)

            return () => clearTimeout(timeoutKey)
        }
    }, [sent, formik])

    return (
        <>
            <div className={`modal-wrapper relative font-[Poppins] !bg-gray-400 w-[59] overflow-x-hidden
                             scrollbar-thin ${status === 'unauthenticated' ? 'login-page' : ''}`}>
                <Modal
                    className="Hello"
                    size="lg"
                    active={show}
                    color='red'
                    toggler={() => {
                        setShow(false)
                    }}
                    onBlur={() => {
                        setShow(false)
                    }}>
                    <h3 className={`text-xl gray text-center ${status === 'unauthenticated' ? 'text-gray-200' : 'text-gray-700'}`}>
                        Contact Me
                    </h3>
                    <AnimatePresence>
                        {(formik.isSubmitting || sent) &&
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                className="absolute rounded-xl flex items-center justify-center top-0 left-0 right-0 bottom-0 w-full h-full bg-white z-[60]"
                            >
                                {formik.isSubmitting && <InfinityLoader className="w-14 h-14" /> ||
                                    sent && <motion.span className={`text-5xl ${status === 'unauthenticated' ? 'text-gray-200' : 'text-gray-700'}`}>Sent!</motion.span>}
                            </motion.div>
                        }
                    </AnimatePresence>
                    <form className="mt-5" onSubmit={formik.handleSubmit}>
                        <ModalBody>
                            <AnimatePresence>
                                {error && <motion.div className="text-red-600 border-red-500 border-2 text-sm rounded-lg py-1 px-2">
                                    {error}
                                </motion.div>}
                            </AnimatePresence>
                            <div className="contact-input mt-3">
                                <Input
                                    outline={true}
                                    color='gray'
                                    name='email'
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        formik.handleChange(e)
                                        setError('')
                                    }}
                                    error={formik.touched.email && formik.errors.email}
                                    value={formik.values.email}
                                    placeholder='Your Email'
                                    disabled={formik.isSubmitting}
                                />
                            </div>
                            <div className="contact-input mt-3">
                                <Input
                                    outline={true}
                                    color='gray'
                                    name='name'
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        formik.handleChange(e)
                                        setError('')
                                    }}
                                    error={formik.touched.name && formik.errors.name}
                                    value={formik.values.name}
                                    placeholder='Your Name'
                                    disabled={formik.isSubmitting}

                                />
                            </div>
                            <div className="contact-input mt-3">
                                <Input
                                    outline={true}
                                    color='gray'
                                    name='subject'
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        formik.handleChange(e)
                                        setError('')
                                    }}
                                    value={formik.values.subject}
                                    error={formik.touched.subject && formik.errors.subject}
                                    placeholder='Subject'
                                    disabled={formik.isSubmitting}
                                />
                            </div>
                            <div className="contact-input mt-3">
                                <Textarea
                                    outline={true}
                                    color='gray'
                                    name='message'
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        formik.handleChange(e)
                                        setError('')
                                    }}
                                    value={formik.values.message}
                                    error={formik.touched.message && formik.errors.message}
                                    placeholder='Your Message Here...'
                                    disabled={formik.isSubmitting}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex items-center justify-end">
                                <Button
                                    type='button'
                                    size="sm"
                                    color="red"
                                    buttonType="link"
                                    ripple="dark"
                                    disabled={formik.isSubmitting}
                                    onClick={() => {
                                        setShow(false)
                                        formik.resetForm()
                                        setError('')
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type='submit'
                                    color="green"
                                    size="sm"
                                    ripple="light"
                                    disabled={formik.isSubmitting}
                                    className='flex items-center justify-center !w-66 !h-30 ml-1'
                                >
                                    Send
                                </Button>
                            </div>
                        </ModalFooter>
                        {status === 'unauthenticated' && <ReCAPTCHA
                            ref={recaptchaRef}
                            size="invisible"
                            badge="bottomleft"
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_ID}
                        />}
                    </form>
                </Modal>
            </div>
            <Button
                onClick={() => { setShow(prev => !prev) }}
                className="fixed bottom-3 right-3"
                color={show ? 'blueGray' : "gray"}
                iconOnly={true}
            >
                <Icon name="contact_support" size='xl' />
            </Button>
        </>
    )
}
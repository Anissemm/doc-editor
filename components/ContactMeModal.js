import React, { useState, useEffect, useRef } from "react"
import Modal from "@material-tailwind/react/Modal"
import ModalBody from "@material-tailwind/react/ModalBody"
import ModalFooter from "@material-tailwind/react/ModalFooter"
import { Icon, Input, Button, Textarea } from "@material-tailwind/react"
import { motion, AnimatePresence } from 'framer-motion'
import { Formik } from "formik"
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
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const recaptchaRef = useRef()

    useEffect(() => {
        if (sent) {
            const timeoutKey = setTimeout(() => {
                setShow(false)
                setSent(false)
            }, 2500)

            return () => clearTimeout(timeoutKey)
        }
    }, [sent])

    return (
        <>
            <div className="modal-wrapper relative font-[Poppins] !bg-gray-400 w-[59] overflow-x-hidden">
                <Modal
                    className="Hello"
                    size="lg"
                    active={show}
                    color='red'
                    toggler={() =>
                        setShow(false)}
                    onBlur={() => {
                        setShow(false)
                    }}>
                    <h3 className="text-xl gray text-center text-gray-700">
                        Contact Me
                    </h3>
                    <AnimatePresence>
                        {error && <motion.div>
                            {error}
                        </motion.div>}
                        {(loading || sent) &&
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                className="absolute rounded-xl flex items-center justify-center top-0 left-0 right-0 bottom-0 w-full h-full bg-white z-[60]"
                            >
                                {loading && <InfinityLoader className="w-14 h-14" /> ||
                                    sent && <motion.span className="text-2xl">Sent!</motion.span>}
                            </motion.div>
                        }
                    </AnimatePresence>
                    <Formik
                        initialValues={{
                            email: '',
                            name: '',
                            subject: '',
                            message: ''
                        }}
                        validationSchema={contactFormSchema}
                        validateOnBlur
                        onSubmit={async (values, { resetForm }) => {
                            let data = values
                            try {
                                if (status === 'unauthenticated') {
                                    const captcha = await recaptchaRef.current.executeAsync()
                                    data = {
                                        ...data,
                                        captcha
                                    }
                                }

                                setLoading(true)

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

                                setLoading(false)
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
                                setLoading(false)

                                if (status === 'unauthenticated') {
                                    recaptchaRef.current.reset()
                                }
                            }
                        }}
                    >
                        {formik => {
                            return (
                                <form className="mt-5" onSubmit={formik.handleSubmit}>
                                    <ModalBody>
                                        <div className="contact-input mt-3">
                                            <Input
                                                outline={true}
                                                color='gray'
                                                name='email'
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                error={formik.touched.email && formik.errors.email}
                                                value={formik.values.email}
                                                placeholder='Your Email'
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="contact-input mt-3">
                                            <Input
                                                outline={true}
                                                color='gray'
                                                name='name'
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                error={formik.touched.name && formik.errors.name}
                                                value={formik.values.name}
                                                placeholder='Your Name'
                                                disabled={loading}

                                            />
                                        </div>
                                        <div className="contact-input mt-3">
                                            <Input
                                                outline={true}
                                                color='gray'
                                                name='subject'
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                value={formik.values.subject}
                                                error={formik.touched.subject && formik.errors.subject}
                                                placeholder='Subject'
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="contact-input mt-3 mb-5">
                                            <Textarea
                                                outline={true}
                                                color='gray'
                                                name='message'
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                value={formik.values.message}
                                                error={formik.touched.message && formik.errors.message}
                                                placeholder='Your Message Here...'
                                                disabled={loading}
                                            />
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <div className="mt-4 flex items-center justify-end">
                                            <Button
                                                type='button'
                                                size="sm"
                                                color="red"
                                                buttonType="link"
                                                ripple="dark"
                                                disabled={loading}
                                                onClick={() => {
                                                    setShow(false)
                                                    formik.resetForm()
                                                }}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                type='submit'
                                                color="green"
                                                size="sm"
                                                ripple="light"
                                                disabled={loading}
                                                className='flex items-center justify-center !w-66 !h-30'
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
                            )
                        }}
                    </Formik>
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
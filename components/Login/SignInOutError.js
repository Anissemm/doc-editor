import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const SignInErrors = ['auth/wrong-password', 'auth/user-not-found', 'auth/user-disabled', 'auth/invalid-email']

const SignInOutError = ({ error, setError }) => {
    const [content, setContent] = useState(null)
    const errorRef = useRef(null)

    useEffect(() => {
        if (SignInErrors.includes(error)) {
            setContent(`You did not sign in correctly or your account is temporarily disabled.`)
            errorRef.current.focus()
        }

        if (error === 'auth/email-already-in-use') {
            setContent('The entered email address is already in use.')
        }
    }, [error])

    return (
        <motion.div
            tabIndex={-1}
            ref={errorRef}
            onBlur={() => { setError(null) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='text-xs max-w-[220px] m-auto text-red-500 text-center border-2 py-1 px-[2px] rounded-xl border-red-500'>
            {content}
        </motion.div>
    )
}

export default SignInOutError
import { Button } from '@material-tailwind/react'
import { motion } from 'framer-motion'

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

const EmailVerificationSent = ({ setForm, email }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-5 z-1 relative font-['Poppins'] mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
            <h2 variants={loginVariants} custom={0}>Email Verification Sent</h2>
            <p className='font-normal py-5'>
                We've sent a verification email to <span className='font-bold'>{email}</span>. Check your account and click the link to activate your account.
                <span className="italic"> (Email can be sent to junk folder)</span>
            </p>
            <Button
                color='blueGray'
                buttonType="filled"
                size="md"
                block={true}
                rounded={false}
                iconOnly={false}
                ripple="light"
                className='mt-3 bg-gray-700 shadow-sm'
                aria-label='Sing in with Email and Password'
                onClick={() => { setForm('signin') }}
            >
                Go Back</Button>
        </motion.div>
    )
}

export default EmailVerificationSent
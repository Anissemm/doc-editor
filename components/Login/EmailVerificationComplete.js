import { Button } from '@material-tailwind/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import useClearQueryIn from '../../hooks/useClearQueryIn'

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


const EmailVerificationComplete = ({ setForm }) => {
    const router = useRouter()
    const secondsLeft = useClearQueryIn(() => { setForm('signin') })

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="z-1 relative font-['Poppins'] mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
            <h2 className='text-2xl' variants={loginVariants} custom={0}>Congratulations!</h2>
            <p className='py-5 px-14 font-normal'>
                Your Email address has been verified!<br />You will redirect automatically to home in {secondsLeft} seconds.
            </p>
            <Button
                color='blueGray'
                buttonType="filled"
                size="md"
                block={true}
                rounded={false}
                iconOnly={false}
                ripple="light"
                className='mt-3 bg-gray-700 shadow-sm max-w-[220px]'
                aria-label='Sing in with Email and Password'
                onClick={() => {
                    setForm('signin')
                    router.push('/', { shallow: true })
                }}
            >
                Go Back</Button>
        </motion.div>
    )
}

export default EmailVerificationComplete
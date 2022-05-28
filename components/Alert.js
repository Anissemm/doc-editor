import { createPortal } from 'react-dom'
import { Alert } from '@material-tailwind/react'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const AlertCustom = ({ show, setTrigger, children, ...props }) => {

    useEffect(() => {
        if (show.status) {
            const timeoutKey = setTimeout(() => {
                setTrigger({ status: false, msg: '' })
            }, 4000)
            return () => {
                clearTimeout(timeoutKey)
            }
        }
    }, [show.status])

    return createPortal(
        ((show.status || show.msg === 'Creating...' || show.msg === 'Deleting...') &&
            <AnimatePresence>
                <motion.div className='fixed bottom-4 left-3 max-w-40 z-[55]'>
                    <Alert {...props}>
                        {children}
                    </Alert>
                </motion.div>
            </AnimatePresence>),
        document.getElementById('__next')
    )
}

export default AlertCustom
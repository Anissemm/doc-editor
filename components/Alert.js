import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const variants = {
    initial: {
        opacity: 0,
        x: -1000,
    },
    animate: {
        opacity: 1,
        x: 0,
    },
    exit: {
        opacity: 0,
        x: -1000,
    },
    transition: {
        duration: 1
    }
}

const AlertCustom = ({ show, setTrigger, color, callback = () => { }, children, className, ...props }) => {
    const colorClassNames = color === 'red' ? 'bg-red-200 text-red-700' :
        color === 'green' ? 'bg-green-200 text-green-700' : ''

    useEffect(() => {
        if (show.status) {
            const timeoutKey = setTimeout(() => {
                setTrigger({ status: false, msg: '' })
                callback()
            }, 4000)
            return () => {
                clearTimeout(timeoutKey)
            }
        }
    }, [show.status, callback, setTrigger])

    return createPortal(
        <AnimatePresence>
            {(show.status || show.msg === 'Creating...' || show.msg === 'Deleting...') &&
                <motion.div className='fixed bg-red font-[Poppins] bottom-4 left-3 max-w-40 z-[55]'>
                    <motion.div {...variants} className={`${colorClassNames} rounded-xl shadow-md py-5 px-8 ${className}`} {...props}>
                        {children}
                    </motion.div>
                </motion.div>}
        </AnimatePresence>
        ,
        document.getElementById('__next')
    )
}

export default AlertCustom
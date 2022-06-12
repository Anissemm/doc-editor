import style from './tooltip.module.css'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePopper } from 'react-popper'

const defaultVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1
    },
    exit: {
        opacity: 0
    }
}

const Tooltip = ({ 
    className, 
    style, 
    children, 
    offset, 
    customVariants = false, 
    strategy = 'absolute', 
    show = false, 
    referenceElement, 
    fallbackPlacements, 
    placement }) => {

    const [popperElement, setPopperElement] = useState(null)

    const Popper = usePopper(referenceElement, popperElement, {
        placement,
        strategy,
        modifiers: [
            {
                name: 'flip',
                options: {
                    fallbackPlacements
                },
            },
            {
                name: 'offset',
                options: {
                  offset: offset || [0, 0],
                },
              },
        ],
    });

    return (
        <>

            <AnimatePresence>
                {show && <motion.div
                    {...(customVariants || defaultVariants)}
                    className={`p-1.5 bg-slate-700 shadow-md rounded-md text-xs italic text-gray-200 ${className}`}
                    ref={setPopperElement}
                    style={{...Popper.styles.popper, ...style}}
                    {...Popper.attributes.popper}
                    data-placement={placement}
                >
                    {children}
                </motion.div>}
            </AnimatePresence>
        </>
    )
}

export default Tooltip
import { useState } from 'react'
import { motion } from 'framer-motion'

const Switcher = ({ firstLabel, firstId, firstValue, secondLabel, secondId, secondValue, setValue, defaultValue }) => {

    const [checked, setChecked] = useState(defaultValue)

    const handleClick = () => {
        setChecked(prev => {
            if (prev === firstValue) {
                setValue(secondValue)
                return secondValue
            }
            setValue(firstValue)
            return firstValue
        })
    }

    return (
        <motion.div className={`bg-gray-200 text-sm flex justify-center items-center cursor-pointer p-[0.2rem] text-gray-600 rounded-lg`} role='switch' >
            <motion.div
                className="relative flex justify-center items-center w-full h-full"
                tabIndex="0"
                onClick={handleClick}
                data-value={firstValue}
                aria-labelledby={firstId}
            >
                {checked === firstValue && <motion.div layoutId='switcher' className="absolute shadow-2xl bg-blue-300 top-0 rounded-lg left-0 bottom-0 right-0 w-full h-full z-1" />}
                <div className={`relative z-2 min-w-10 px-1 py-0.5 text-[12px] transition ${checked === firstValue && 'text-gray-800'}`} id={firstId}>{firstLabel}</div>
            </motion.div>
            <motion.div
                className="relative flex justify-center items-center w-full h-full"
                tabIndex="0"
                onClick={handleClick}
                data-value={secondValue}
                aria-labelledby={secondId}
            >
                {checked === secondValue && <motion.div layoutId='switcher' className="absolute shadow-2xl top-0 bg-blue-300 rounded-lg left-0 bottom-0 right-0 w-full h-full z-1" />}
                <div className={`relative z-2 min-w-10 px-1 py-0.5 text-[12px] transition ${checked === secondValue && 'text-gray-800'} `} id={secondId}>{secondLabel}</div>
            </motion.div>
        </motion.div>
    )
}

export default Switcher
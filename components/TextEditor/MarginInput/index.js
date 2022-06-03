import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import styles from './marginInput.module.css'

const MarginInput = () => {
    const [margin, setMargin] = useState(2)
    const [maxValue, setMaxValue] = useState(40)
    const [minValue, setMinValue] = useState(0.5)
    const [stepValue, setStepValue] = useState(0.1)
    const [alert, setAlert] = useState(false)

    const incrementByStep = (prev, step) => {
        return parseFloat((prev + stepValue).toFixed(1))
    }

    const decrementByStep = (prev, step) => {
        return parseFloat((prev - stepValue).toFixed(1))
    }

    const setMarginVerified = (current) => {
        setAlert(false)
        if (typeof current === 'function') {
            current = current(margin)
        }

        if (current >= minValue && current <= maxValue) {
            setMargin(current)
        } else {
            setAlert(true)
            setMargin(margin)
        }
    }

    useEffect(() => {
        if (alert) {
            const timeoutKey = setTimeout(() => { setAlert(false) }, 2000)
            return () => {
                clearTimeout(timeoutKey)
            }
        }
    }, [alert])

    return (
        <div className="flex items-center justify-center w-20">
            <input
                className={`${styles.input}`}
                id="vertical-margin"
                type='number'
                max={maxValue}
                min={minValue}
                step={stepValue}
                value={margin}
                onChange={(e) => {
                    const value = parseFloat(e.target.value)
                    setMarginVerified(value)
                }}
                aria-labelledby="margins"
                aria-label="Vertical margins"
            />
            <button
                aria-label={`Increment by ${stepValue}mm`}
                onClick={() => setMarginVerified(prev => incrementByStep(prev, stepValue))} >+</button>
            <button
                aria-label={`Decrement by ${stepValue}mm`}
                onClick={() => setMarginVerified(prev => decrementByStep(prev, stepValue))}>-</button>
        </div>
    )
}

export default MarginInput
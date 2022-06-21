import { useEffect, useState, useContext } from "react"
import styles from './marginInput.module.css'
import Tooltip from '../../Tooltip'
import { EditorContext } from "../../../Providers/EditorProvider"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { db } from "../../../firebase"

const MarginInput = (props) => {
    const { data: session } = useSession()
    const router = useRouter()

    const query = db.collection('userDocs').doc(session?.user?.email).collection('docs').doc(router.query.id)

    const [documentLayout, setDocumentLayout] = useContext(EditorContext).useDocumentLayout

    const [margin, setMargin] = useState(documentLayout?.margins[props.type])
    const [maxValue, _setMaxValue] = useState(4)
    const [minValue, _setMinValue] = useState(1)
    const [stepValue, _setStepValue] = useState(0.1)
    const [alert, setAlert] = useState({ show: false, msg: `` })
    const [reference, setReference] = useState(null)

    const incrementByStep = (prev) => {
        return parseFloat((prev + stepValue).toFixed(1))
    }

    const decrementByStep = (prev) => {
        return parseFloat((prev - stepValue).toFixed(1))
    }

    const setMarginVerified = async (current) => {
        setAlert(false)
        if (typeof current === 'function') {
            current = current(margin)
        }

        if (current >= minValue && current <= maxValue) {
            setMargin(current)
            setDocumentLayout({
                ...documentLayout,
                margins: {
                    ...documentLayout?.margins,
                    [props.type]: current
                }
            })
            await query.set({
                layout: {
                    margins: {
                        [props.type]: current
                    }
                }
            }, { merge: true })
            return
        } else if (current <= minValue) {
            setAlert({ show: true, msg: `Minimal acceptable value is ${minValue}` })
        } else if (current >= maxValue) {
            setAlert({ show: true, msg: `Maximal acceptable value is ${maxValue}` })
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
        <div tabIndex="1"
            className={`${styles.inputContainer} 
                        ${props.id === 'vertical-margin' ? styles.inputVertical : styles.inputHorizontal} 
                        pl-4 flex items-center justify-center w-[4rem] relative pr-[20px] rounded-sm shadow-md 
                        bg-white !focus-within:bg-gray-400`}>
            <input
                ref={setReference}
                className={`${styles.input}  
                leading-none max-w-full py-[3px] !px-[6px] text-sm bg-transparent focused:border-none !text-[12px]`}
                id={props.id}
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
                aria-label={props.label}
            />
            <Tooltip
                strategy={'fixed'}
                show={alert.show}
                referenceElement={reference}
                placement='top'
                fallbackPlacements={['bottom', 'left']}>
                {alert.msg}
            </Tooltip>

            <div className="absolute right-0 top-0 flex flex-col h-full justify-center">
                <button
                    className="p-0 leading-3 h-[45%] transition rounded-sm hover:bg-gray-300"
                    aria-label={`Increment ${props.label} by ${stepValue}cm`}
                    onClick={() => setMarginVerified(prev => incrementByStep(prev, stepValue))} >
                    <span className="material-icons undefined text-base !leading-none relative -top-1">expand_less</span>
                </button>
                <button
                    className="p-0 leading-3 h-[45%] transition rounded-sm hover:bg-gray-300"
                    aria-label={`Decrement ${props.label} by ${stepValue}cm`}
                    onClick={() => setMarginVerified(prev => decrementByStep(prev, stepValue))}>
                    <span className="material-icons undefined text-base !leading-3 flex items-center justify-center">expand_more</span>
                </button>
            </div>
        </div>

    )
}

export default MarginInput
import style from './tooltip.module.css'
import { useState } from 'react'
import { usePopper } from 'react-popper'

const Tooltip = () => {
    const [referenceElement, setReferenceElement] = useState(null)
    const [popperElement, setPopperElement] = useState(null)
    const [arrowElement, setArrowElement] = useState(null)
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
    });
    const [show, setShow] = useState(false)
    
    return (
        <>
            <button type="button" ref={setReferenceElement} onClick={() => setShow(prev => !prev)}>
                Reference element
            </button>

            {show && <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
                Popper element
                <div ref={setArrowElement} style={styles.arrow} />
            </div>}
        </>
    )
}

export default Tooltip
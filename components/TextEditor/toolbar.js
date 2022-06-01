import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@material-tailwind/react'
import { fontSizesWithPx } from './paramValues'

const Toolbar = ({ setToolbarMounted }) => {
    const [size, setSize] = useState('16px')
    const [expanded, setExpanded] = useState(false)

    const toolbarRef = useRef(null)
    useEffect(() => {
        if (!!toolbarRef.current) setToolbarMounted(true)
    }, [toolbarRef.current])

    return (
        <div ref={useCallback((ref) => {
            if (ref) {
                toolbarRef.current = ref
            }
        }, [toolbarRef.current])} id='format-toolbar'/>
    )
}

export default Toolbar
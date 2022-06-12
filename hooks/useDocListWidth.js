import { useState, useEffect } from "react"

const useDocListWidth = (docListRef) => {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        if (docListRef.current) {
            setWidth(docListRef.current.offsetWidth)
            const handleResize = () => {
                setWidth(docListRef.current.offsetWidth)
            }
            window.addEventListener('resize', handleResize, false)
            return () => {
                window.removeEventListener('resize', handleResize, false)
            }
        }
    }, [docListRef.current])
    return width
}

export default useDocListWidth


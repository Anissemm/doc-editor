import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const useClearQueryIn = (sec = 5, to, callback, options) => {
    if (typeof sec === 'function' && (!to || typeof to === 'object') && !callback && !options) {
        options = typeof to === 'object' ? to : { clear: true }
        to = '/'
        callback = sec
        sec = 5
    }

    if (typeof to === 'function' && (!callback || typeof callback === 'object') && !options) {
        options = typeof callback === 'object' ? callback : { clear: true }
        callback = to
        to = '/'
    }

    if (typeof callback === 'function' && (!options || typeof options === 'object')) {
        options = typeof options === 'object' ? options : { clear: true }
    }

    const { clear } = options
    const router = useRouter()
    const [seconds, setSeconds] = useState(sec)

    useEffect(() => {
        if (clear) {
            const redirectTimeoutKey = setTimeout(() => {
                if (typeof callback === 'function') callback()
                router.push(to, { shallow: true })
            }, 1000 + (seconds * 1000))

            const counterIntervalKey = setInterval(() => {
                setSeconds(prev => {
                    if (prev > 0) {
                        return prev - 1
                    } else {
                        clearInterval(counterIntervalKey)
                        return prev
                    }
                })
            }, 1000)

            return () => {
                clearTimeout(redirectTimeoutKey)
                clearInterval(counterIntervalKey)
            }
        }
    }, [clear])

    return seconds
}

export default useClearQueryIn
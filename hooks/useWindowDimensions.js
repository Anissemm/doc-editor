import { useState, useEffect } from 'react'

export const useWindowDimensions = () => {

    const hasWindow = typeof window !== 'undefined';

    const getWindowDimensions = () => {
        const width = hasWindow ? window.innerWidth : null;
        const height = hasWindow ? window.innerHeight : null;
        return {
            width,
            height,
        };
    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        if (hasWindow) {
            const handleResize = () => {
                setWindowDimensions(getWindowDimensions());
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [hasWindow]);

    return windowDimensions;
}

export const useDocumentScrollDimensions = () => {

    const hasDocument = typeof document !== 'undefined';

    let scrollH = hasDocument ? Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    ) : null;

    let scrollW = hasDocument ? Math.max(
        document.body.scrollWidth, document.documentElement.scrollWidth,
        document.body.offsetWidth, document.documentElement.offsetWidth,
        document.body.clientWidth, document.documentElement.clientWidth
    ) : null;

    const getDocumentScrollDimensions = () => {
        const scrollWidth = scrollW;
        const scrollHeight = scrollH;
        return {
            scrollWidth,
            scrollHeight,
        };
    }

    const [documentScrollDimensions, setDocumentScrollDimensions] = useState(getDocumentScrollDimensions())

    useEffect(() => {
        if (hasDocument) {
            const handleResize = () => {
                setDocumentScrollDimensions(getDocumentScrollDimensions());
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [hasDocument]);

    return documentScrollDimensions;
}
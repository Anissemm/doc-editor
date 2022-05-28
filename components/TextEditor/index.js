import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useRef, useState } from "react"

import { fontSizes } from "./paramValues"
import { registerFontSizes } from './functions'
import { db } from "../../firebase"
import { useSession } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import InfinityLoader from "../../assets/svg/InfinityLoader"
import { serverTimestamp } from "firebase/firestore"

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': fontSizes }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
]

const TextEditor = ({ docId }) => {
    const { data: session } = useSession()
    const router = useRouter()

    const [quill, setQuill] = useState(null)
    const [content, setContent] = useState(null)
    const [overlayCompleted, setOverlayCompleted] = useState(false)

    const query = db.collection('userDocs').doc(session?.user?.email).collection('docs').doc(router.query.id)

    const wrapperRef = useCallback((editorSection) => {
        if (editorSection === null) return
        editorSection.innerHTML = ''

        registerFontSizes(fontSizes)

        const editorWrapper = document.createElement('div')
        editorSection.append(editorWrapper)
        const editor = new Quill(editorWrapper, {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'
        })

        setQuill(editor)
    }, [])

    useEffect(() => {
        query.get().then(snapshot => {
            if (!snapshot.exists) router.replace('/', '/')
        })
    }, [])

    useEffect(() => {
        if (!quill) return
        quill.on('text-change', (_delta, _oldDelta, source) => {
            console.log(quill.getContents())
            if (source !== 'user') return

            query.set({
                content: JSON.stringify(quill.getContents()),
                modifiedAt: serverTimestamp()
            }, { merge: true })
        })
    }, [quill])

    useEffect(() => {
        if (content && quill) {
            quill.setContents(content)
            quill.enable()
        }
    }, [content, quill])

    useEffect(() => {
        query.get().then(doc => {
            const { content } = doc?.data()
            if (content) {
                const parsed = JSON.parse(content)
                setContent(parsed)
            }
        })
    }, [])

    useEffect(() => {
        if (!router.isFallback) setOverlayCompleted(true)
    }, [router.isFallback])

    return (
        <>

            <AnimatePresence >
                {!overlayCompleted && <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='bg-gray-500 h-screen w-screen fixed top-0 left-0 z-[54] flex items-center justify-center' >
                    <InfinityLoader className="w-28 h-28" />
                </motion.div>}
            </AnimatePresence>
            <motion.section ref={wrapperRef}></motion.section>
        </>
    )
}

export default TextEditor
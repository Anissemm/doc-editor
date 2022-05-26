import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useRef, useState } from "react"

import { fontSizes } from "./paramValues"
import { registerFontSizes } from './functions'
import { db } from "../../firebase"
import { useSession } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"

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
    const [quill, setQuill] = useState(null)
    const [content, setContent] = useState(null)
    const [overlayCompleted, setOverlayCompleted] = useState(false)

    const query = db.collection('userDocs').doc(session?.user?.email).collection('docs').doc(docId)

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
        editor.disable()
    }, [])

    useEffect(() => {
        if (!quill) return
        quill.on('text-change', (_delta, _oldDelta, source) => {
            if (source !== 'user') return

            query.set({
                content: JSON.stringify(quill.getContents()),
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
            const { content } = doc.data()
            if (content) {
                const parsed = JSON.parse(content)
                setContent(parsed)
            }
        })
    }, [])

    return (
        <>
            {!overlayCompleted && <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                onAnimationComplete={() => {
                    setOverlayCompleted(true)
                }}
                className='bg-gray-500 h-screen w-screen fixed top-0 left-0 z-[54]' />}
            <section ref={wrapperRef}></section>
        </>
    )
}

export default TextEditor
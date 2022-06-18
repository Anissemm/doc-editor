import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useState, useContext, memo } from "react"
import Delta from 'quill-delta'
import { fontSizesWithPx, toolbarOptions } from "./paramValues"
import { registerAttributors, setRedo, setUndo, updateDocContent } from './functions'
import { db } from "../../firebase"
import { useSession } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import InfinityLoader from "../../public/svg/InfinityLoader"
import { EditorContext } from "../../Providers/EditorProvider"
import useDocumentLayoutUpdate from "../../hooks/useDocumentLayoutUpdate"
import useQuillHistory from "../../hooks/useQuillHistory"

const TextEditor = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const editorCtx = useContext(EditorContext)
    const [_contents, setContents] = editorCtx.useContents
    const [quillMounted, setQuillMounted] = editorCtx.useQuillState

    const [quill, setQuill] = useState(null)
    const [overlayCompleted, setOverlayCompleted] = useState(false)

    const query = db.collection('userDocs').doc(session?.user?.email).collection('docs').doc(router.query.id)

    const wrapperRef = useCallback((editorSection) => {
        if (editorSection === null) return

        editorSection.innerHTML = ''

        registerAttributors({fontSizes: fontSizesWithPx})

        const editorWrapper = document.createElement('div')
        editorSection.append(editorWrapper)
        const editor = new Quill(editorWrapper, {
            modules: {
                toolbar: toolbarOptions,
                history: {
                    delay: 50,
                    maxStack: 500,
                    userOnly: true
                }
            },
            theme: 'snow'
        })

        setQuill(editor)
        setQuillMounted(true)
    }, [setQuillMounted])

    useDocumentLayoutUpdate()

    useQuillHistory(quill)

    useEffect(() => {
        if (!quill) return
        const instantTypeSaveHandler = (_delta, _oldDelta, source) => {

            if (source !== 'user') return

            const content = quill.getContents()

            setContents(content)
            updateDocContent(query, content, 1500)
        }


        quill.on('text-change', instantTypeSaveHandler)

        return () => { quill.off('text-change', instantTypeSaveHandler) }

    }, [quill, query, setContents])

    useEffect(() => {
        query.get().then(doc => {
            const { content } = doc?.data()
            if (doc.exists && quillMounted && quill) {
                const parsed = JSON.parse(content)
                setContents(new Delta(parsed.ops))
                quill.setContents(parsed)
            }
        })
    }, [quillMounted, quill])

    useEffect(() => {
        if (!router.isFallback) setOverlayCompleted(true)
    }, [router.isFallback])

    return (
        <>

            <AnimatePresence >
                {!overlayCompleted && <motion.div
                    initial={false}
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

export default memo(TextEditor)
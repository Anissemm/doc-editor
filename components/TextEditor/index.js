import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useState } from "react"
import Delta from 'quill-delta'
import { fontSizesWithPx, toolbarOptions } from "./paramValues"
import { registerAttributors, setRedo, setUndo } from './functions'
import { db } from "../../firebase"
import { useSession } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import InfinityLoader from "../../assets/svg/InfinityLoader"
import { serverTimestamp } from "firebase/firestore"

const TextEditor = ({ setContents, setQuillMounted, quillMounted }) => {

    const { data: session } = useSession()
    const router = useRouter()

    const [quill, setQuill] = useState(null)
    const [content, setContent] = useState(null)
    const [overlayCompleted, setOverlayCompleted] = useState(false)

    const query = db.collection('userDocs').doc(session?.user?.email).collection('docs').doc(router.query.id)

    const wrapperRef = useCallback((editorSection) => {
        if (editorSection === null) return

        editorSection.innerHTML = ''

        const optionsToRegister = {
            fontSizes: fontSizesWithPx
        }

        registerAttributors(optionsToRegister)

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
    }, [])

    useEffect(() => {
        query.get().then(snapshot => {
            if (!snapshot.exists) router.replace('/', '/')
        })
    }, [])

    useEffect(() => {    
        if(quillMounted) {
            const redoBtn = document.querySelector('.ql-redo')
            const undoBtn = document.querySelector('.ql-undo')
    
            const handleUndo = () => {
                quill.getContents()
                quill.history.undo()
            }
    
            const handleRedo = () => {
                quill.history.redo()
            }
    
            undoBtn.addEventListener('click', handleUndo)
            redoBtn.addEventListener('click', handleRedo)
    
            return () => {
    
                undoBtn.removeEventListener('click', handleUndo)
                redoBtn.removeEventListener('click', handleRedo)
            }
        }
    }, [quillMounted])

    useEffect(() => {
        if (!quill) return
        quill.on('text-change', (_delta, _oldDelta, source) => {

            if (source !== 'user') return

            setContents(quill.getContents())

            query.set({
                content: JSON.stringify(quill.getContents()),
                modifiedAt: serverTimestamp()
            }, { merge: true })
        })
    }, [quill])

    useEffect(() => {
        if (content && quill) {
            setContents(new Delta(content.ops))
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

export default TextEditor
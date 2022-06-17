import { useEffect, useRef, useState, useContext } from 'react'
import { useDocumentData } from "react-firebase-hooks/firestore"
import { db } from "../firebase"
import { useRouter } from 'next/router'
import { Icon, Button } from '@material-tailwind/react'
import Logo from './Logo'
import { motion, AnimatePresence } from 'framer-motion'
import InfinityLoader from '../public/svg/InfinityLoader'
import { serverTimestamp } from 'firebase/firestore'
import EditorToolbar from './EditorToolbar'
import { useWindowDimensions } from '../hooks/useWindowDimensions'
import { EditorContext } from '../Providers/EditorProvider'

const loadVariants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }

function EditorHeader({ userEmail }) {
    const router = useRouter()
    const { width } = useWindowDimensions()

    const [filename, setFilename] = useContext(EditorContext).useFilename

    const textBoxSpanRef = useRef(null)
    const textBoxRef = useRef(null)
    const headerRef = useRef(null)

    const query = db.collection('userDocs').doc(userEmail).collection('docs').doc(router.query.id)
    const [document] = useDocumentData(query)

    useEffect(() => {
        setFilename(document?.filename)
    }, [document])

    useEffect(() => {
        if (filename) {
            query.update({
                filename,
                modifiedAt: serverTimestamp()
            })
        }
    }, [filename])

    const handleNameChange = (e) => {
        if (e.target.textContent === '') {
            return setFilename('Untitled')
        }
        setFilename(e.target.textContent)
    }

    return (
        <header ref={headerRef} className='editor-main-header py-1 sm:!py-3 px-2  sm:!px-5 flex flex-col sm:!flex-row items-center sticky top-0 z-50 shadow-md bg-white justify-between'>
            <div className='flex justify-between items-center text-gray-800 mr-auto sm:mx-0'>
                <Button
                    ripple='dark'
                    color='transparent'
                    iconOnly={true}
                    aria-label="Go to previous page"
                    className='cursor-pointer flex items-center outline-none rounded-full justify-center pl-[10px]'
                    onClick={() => { router.replace('/', '/') }}
                >
                    <Icon name='arrow_back_ios' size={width >= 640 ? 'xl' : 'lg' } color="gray" />
                </Button>
                <Logo />
                <div className='ml-2 sm:ml-5'>
                    <motion.h2 className='flex flex-row sm:!flex-col items-center sm:!items-start justify-between text-md ml-2 font-medium' aria-label={filename}>
                        <motion.span
                            ref={textBoxRef}
                            className='py-0 px-1 sm:!px-2 border-0 text-sm border-gray-400 outline-1 outline-gray-100 transition duration-1000 text-gray-600 focus:text-gray-800'
                            name="filename"
                            role="textbox"
                            contentEditable={true}
                            spellCheck={false}
                            suppressContentEditableWarning={true}
                            onBlur={handleNameChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleNameChange(e)
                                    e.target.blur()
                                }
                            }}
                        >
                            <AnimatePresence>
                                {filename ? <motion.span ref={textBoxSpanRef} {...loadVariants}>{filename}</motion.span> : <InfinityLoader {...loadVariants} className="h-5 w-5" />}
                            </AnimatePresence>
                        </motion.span>
                        <small className='text-gray-400 flex align-center justify-center !text-[11px] cursor-pointer select-none'
                            onClick={() => {
                                const input = textBoxRef.current
                                const inputSpan = textBoxSpanRef.current
                                const range = new Range()
                                const set = window.getSelection()
                                range.setStart(inputSpan.firstChild, filename.length)
                                range.collapse(true)
                                set.removeAllRanges()
                                set.addRange(range)
                                input.focus()
                            }}
                        >
                            <span className='pl-2 pr-1'>Edit</span>
                            <Icon name="edit" color='gray' size='xs' className="align-middle" />
                        </small>
                    </motion.h2>
                </div>
            </div>
            <EditorToolbar filename={filename} headerRef={headerRef} />
        </header >
    )
}

export default EditorHeader
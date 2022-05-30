import React, { useEffect, useRef, useState } from 'react'
import { useDocumentData } from "react-firebase-hooks/firestore"
import { db } from "../firebase"
import { useRouter } from 'next/router'
import { Icon, Button } from '@material-tailwind/react'
import Logo from '../assets/svg/logo'
import { motion, AnimatePresence } from 'framer-motion'
import InfinityLoader from '../assets/svg/InfinityLoader'
import { downloadFile } from './TextEditor/functions'
import { serverTimestamp } from 'firebase/firestore'
import { useWindowDimensions } from '../hooks/useWindowDimensions'
import { Tabs, Tab, TabContent } from 'react-bootstrap'

const loadVariants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }

function EditorHeader({ userEmail, contents }) {
    const router = useRouter()
    const [filename, setFilename] = useState('')
    const query = db.collection('userDocs').doc(userEmail).collection('docs').doc(router.query.id)

    const [document] = useDocumentData(query)
    const windowDimensions = useWindowDimensions()
    const isMdScreen = windowDimensions.width > 768
    const textBoxSpanRef = useRef(null)
    const textBoxRef = useRef(null)

    const [key, setKey] = useState('general')

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
        <header className='editor-main-header py-3 flex items-center sticky top-0 z-50 px-5 shadow-md bg-white justify-between'>
            <div className='flex justify-between items-center text-gray-800'>
                <Button
                    ripple='dark'
                    color='transparent'
                    iconOnly={true}
                    aria-label="Go to previous page"
                    className='cursor-pointer flex items-center outline-none rounded-full justify-center pl-[10px]'
                    onClick={() => { router.back() }}
                >

                    <Icon name='arrow_back_ios' size="md" color="gray" />
                </Button>
                <Logo className='cursor-pointer w-6 h-6 fill-blue-700' />
                <div className='ml-2 sm:ml-5'>
                    <motion.h2 className='flex flex-col items-start justify-between text-md ml-2 font-medium' aria-label={filename}>
                        <motion.span
                            ref={textBoxRef}
                            className='py-0 px-2 border-0 text-sm border-gray-400 outline-1 outline-gray-100 transition duration-1000 text-gray-600 focus:text-gray-800'
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

            <motion.div className='flex self-end relative top-[16px]'>

                <motion.span>
                    <Button
                        color='transparent'
                        buttonType='outline'
                        ripple='dark'
                        size='sm'
                        onClick={() => setKey('file')}
                        className='!rounded-none'
                    >
                        File
                        {key === 'file' && <motion.span animate={{ x: 0 }} layout className='absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-gray-500' />}
                    </Button>
                </motion.span>

                <motion.span>
                    <Button
                        color='transparent'
                        buttonType='outline'
                        ripple='dark'
                        size='sm'
                        onClick={() => setKey('general')}
                        className='!rounded-none'
                    >
                        General
                        {key === 'general' && <motion.span animate={{ x: 0 }} layout className='absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-gray-500' />}
                    </Button>
                </motion.span>

                <motion.span>
                    <Button
                        color='transparent'
                        buttonType='outline'
                        ripple='dark'
                        size='sm'
                        onClick={() => setKey('layout')}
                        className='!rounded-none relative'
                    >
                        Layout
                        {key === 'layout' && <motion.span animate={{ x: 0 }} layout className='absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-gray-500' />}
                    </Button>
                </motion.span>

                <motion.span>
                    <Button
                        color='transparent'
                        buttonType='outline'
                        ripple='dark'
                        size='sm'
                        onClick={() => setKey('view')}
                        className='!rounded-none'
                    >
                        View
                        {key === 'view' && <motion.span animate={{ x: 0 }} layout className='z-2 absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-gray-500' />}
                    </Button>
                </motion.span>

            </motion.div>

            <div className='flex gap-1'>
                <Button
                    iconOnly={!isMdScreen}
                    size="sm"
                    color="gray"
                    title='Print'
                    aria-label="Print"
                    onClick={() => {
                        window.print()
                    }}
                >
                    {isMdScreen ? 'Print' : ''}
                    <Icon name="print" />
                </Button>
                <Button
                    iconOnly={!isMdScreen}
                    size="sm"
                    color="gray"
                    onClick={() => {
                        downloadFile(filename)
                        // delta2docx(filename, contents)
                    }}
                    title="Download file"
                    aria-label="Download File"
                >
                    {isMdScreen ? 'Download' : ''}
                    <Icon name="save" />
                </Button>
            </div>
        </header >
    )
}

export default EditorHeader
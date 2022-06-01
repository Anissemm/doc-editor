import React, { useEffect, useState, useRef } from 'react'
import { AnimatePresence, m, motion } from 'framer-motion'
import { Button } from '@material-tailwind/react'
import FileButtons from './TextEditor/FileButtons'
import LayoutMenu from './TextEditor/LayoutMenu'

const menus = [
    {
        name: 'File',
        key: 'file'
    },
    {
        name: 'Format',
        key: 'format'
    },
    {
        name: 'Layout',
        key: 'layout'
    },
    {
        name: 'View',
        key: 'view'
    }
]


const EditorToolbarHeader = ({ quillMounted, headerRef }) => {
    const [key, setKey] = useState('format')
    const toolbarClientHeight = useRef(0)

    useEffect(() => {
        if (quillMounted) {
            const toolbar = document.querySelector('.ql-toolbar')
            toolbarClientHeight.current = toolbar?.clientHeight

            const handleResize = () => {
                toolbarClientHeight.current = toolbar?.clientHeight
            }

            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [quillMounted])

    const menuVariants = {
        initial: {
            height: 0,
            opacity: 0
        },
        animate: {
            height: toolbarClientHeight.current,
            opacity: 1
        },
        exit: {
            height: 0,
            opacity: 0
        },
    }

    return (
        <>
            <motion.div className='flex items-center relative top-[20px]'>
                {menus.map((item, i) => {
                    const { key: itemKey, name } = item
                    return (
                        <motion.span key={`${itemKey}-${i}`} className="relative">
                            <Button
                                color='transparent'
                                buttonType='outline'
                                ripple='dark'
                                size='sm'
                                onClick={() => setKey(itemKey)}
                                className='!rounded-none relative'
                            >
                                {
                                    key === itemKey &&
                                    <AnimatePresence exitBeforeEnter>
                                        <motion.span initial={{ height: 0 }} animate={{ height: '100%' }} exit={{ height: 0 }} className='bg-blue-100 absolute left-0 right-0 top-0 w-full z-0' />
                                    </AnimatePresence>
                                }
                                <span className='relative z-1'>{name}</span>
                            </Button>
                            {key === itemKey && <motion.span layoutId='background' className='absolute left-0 right-0 bottom-0 w-full h-[4px] bg-blue-400' />}
                        </motion.span>
                    )
                })}
            </motion.div>
            <AnimatePresence exitBeforeEnter>
                {key === 'file' &&
                    <motion.div
                        style={{ height: toolbarClientHeight.current, top: headerRef.current.clientHeight }}
                        className="fixed w-screen left-0 bg-gradient-to-b from-white to-gray-300 shadow-xl overflow-hidden"
                        {...menuVariants}>
                        <motion.span
                            layoutId='file'
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            exit={{ x: -100 }}
                            className='absolute z-0 text-6xl left-3 -bottom-3 text-gray-500'>
                            File
                        </motion.span>
                        <motion.div className='flex items-center justify-center gap-3 relative z-1' {...menuVariants}>
                            <FileButtons />
                        </motion.div>
                    </motion.div>}
                {key === 'layout' &&
                    <motion.div
                        style={{ height: toolbarClientHeight.current, top: headerRef.current.clientHeight }}
                        className="fixed w-screen left-0 bg-gradient-to-b from-white to-gray-300 shadow-xl overflow-hidden"
                        {...menuVariants}>
                        <motion.span
                            layoutId='layout'
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            exit={{ x: -100 }}
                            className='absolute z-0 text-6xl left-3 -bottom-3 text-gray-500'>
                            Layout
                        </motion.span>
                        <motion.div className='flex items-center justify-center'>
                            <LayoutMenu />
                        </motion.div>
                    </motion.div>}
                {key === 'view' &&
                    <motion.div
                        style={{ height: toolbarClientHeight.current, top: headerRef.current.clientHeight }}
                        className="fixed w-screen left-0 bg-gradient-to-b from-white to-gray-300 shadow-xl overflow-hidden"
                        {...menuVariants}>
                        <motion.span
                            layoutId='view'
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            exit={{ x: -100 }}
                            className='absolute z-0 text-6xl left-3 -bottom-3 text-gray-500'>
                            View
                        </motion.span>
                    </motion.div>}
            </AnimatePresence>
        </>
    )
}

export default EditorToolbarHeader
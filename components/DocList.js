import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { db } from "../firebase"
import { useCollection } from 'react-firebase-hooks/firestore'
import Time from '../components/TimeAgo'
import Link from 'next/link'
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import InfinityLoader from "../public/svg/InfinityLoader"
import isEqual from "lodash.isequal"
import dynamic from "next/dynamic"
import Icon from "@material-tailwind/react/Icon"
import Button from "@material-tailwind/react/Button"
import Tooltip from './Tooltip'
import useDocListWidth from "../hooks/useDocListWidth"
import { useWindowDimensions } from "../hooks/useWindowDimensions"
import { useClickOutside } from "react-click-outside-hook"

const AlertCustom = dynamic(import('../components/Alert'), { ssr: false })

const loadVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
}

const deleteTooltipVariants = {
    initial: {
        opacity: 0,
        x: 250
    },
    animate: {
        opacity: 1,
        x: 0
    },
    exit: {
        opacity: 0,
        x: 250
    },
    transition: {
        duration: 0.5
    }
}

const DocList = () => {
    const { data: session } = useSession()

    const [showArrDropdown, setShowArrDropdown] = useState(false)
    const [itemsCount, setItemsCount] = useState(2)
    const [noMoreDocs, setNoMoreDocs] = useState(false)
    const [deleted, setDeleted] = useState({ status: false, msg: 'void' })
    const [onShowMore, setShowMore] = useState(null)
    const [sort, setSort] = useState({ by: 'createdAt', direction: 'asc' })


    const arrBtns = [
        {
            by: 'filename',
            description: '[A-Z]',
            direction: 'asc'
        },
        {
            by: 'filename',
            description: '[Z-A]',
            direction: 'desc'
        },
        {
            by: 'createdAt',
            description: 'Created at',
            direction: 'asc'
        },
        {
            by: 'createdAt',
            description: 'Created at',
            direction: 'desc'
        },
        {
            by: 'modifiedAt',
            description: 'Modified at',
            direction: 'asc'
        },
        {
            by: 'modifiedAt',
            description: 'Modified at',
            direction: 'desc'
        }
    ]

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const showDeleteConfirmRefs = useRef({})
    const docListRef = useRef(null)
    const docListWidth = useDocListWidth(docListRef, noMoreDocs)

    const { width: windowWidth } = useWindowDimensions()
    const isSmallScreen = () => windowWidth < 640

    const showMoreBtnRef = useRef(null)

    const firestoreQuery = db.collection('userDocs').doc(session.user?.email).collection('docs')
    const [documents, docsLoading] = useCollection(firestoreQuery.orderBy(sort.by, sort.direction).limit(itemsCount))

    let [arrangeDropdown, isClickedOutOfDropdown] = useClickOutside()
    let [arrangeDropdownBtn , isClickedOutOfDropdownBtn] = useClickOutside()

    useEffect(() => {
        if (isClickedOutOfDropdown && isClickedOutOfDropdownBtn) {
            setShowArrDropdown(false)
        }
    }, [isClickedOutOfDropdownBtn, isClickedOutOfDropdown])

    useEffect(() => {
        const refs = showDeleteConfirmRefs.current

        const handleOffsetClick = (e) => {
            const isNotDeleteButton = !(e.target?.dataset?.deleteButton || e.target.parentElement?.dataset?.deleteButton)

            if (showDeleteConfirm && !Object.values(refs).includes(e.target) && isNotDeleteButton) {
                setShowDeleteConfirm(false)
            }
        }

        document.addEventListener('click', handleOffsetClick, false)

        return () => {
            document.removeEventListener('click', handleOffsetClick, false)
        }

    }, [showDeleteConfirm, showDeleteConfirmRefs])

    const deleteDoc = async (docId) => {
        setDeleted({ status: false, msg: 'Deleting...' })

        try {
            if (docId) {
                const { filename } = documents?.docs.find(doc => doc.id === docId).data()
                await firestoreQuery.doc(docId).delete()
                setDeleted({ status: true, msg: `File "${filename}" was deleted!` })
            }
        } catch (err) {
            setDeleted({ status: false, msg: `ERROR: ${err.name}` })
        }
    }

    useEffect(() => {
        if (documents) {
            const { docs } = documents
            const data = docs?.map(doc => doc.data())

            firestoreQuery.orderBy(sort.by, sort.direction).get().then((temp) => {
                const tempData = temp?.docs.map(snapshot => snapshot.data())

                if (isEqual(data, tempData)) {
                    return setNoMoreDocs(true)
                }
                setShowMore(true)
                setNoMoreDocs(false)
            })
        }
    }, [documents, firestoreQuery, sort.by, sort.direction])

    let docs = documents?.docs.map((document) => {
        const data = document.data()

        return (
            <motion.li
                layout
                data-doc-id={document.id}
                className='flex !h-min-[50px] items-center justify-center my-1 border px-1.5 py-2 
                    font-medium rounded border-1 border-gray-200 hover:bg-gray-50 transition'
                key={document.id}
                {...loadVariants}
                transition={{
                    duration: 0.01
                }}

                onLayoutAnimationComplete={() => {
                    if (onShowMore) {
                        showMoreBtnRef.current.scrollIntoView()
                        setShowMore(false)
                    }
                }}
            >
                <Link href={`/doc/${document.id}`}>
                    <a className='flex items-center grow justify-between w-full text-gray-600 pl-3 text-[13px]'>
                        <span className="truncate max-w-[110px] sm:max-w-[300px] whitespace-nowrap text-ellipsis">{data.filename}</span>
                        <Time className='text-gray-500 font-normal text-[9px] xs:text-[10px]' date={data.modifiedAt ? data.modifiedAt.toMillis() : Date.now()} />
                    </a>
                </Link>
                <motion.div className="relative">
                    <Button
                        data-delete-button={true}
                        ref={ref => showDeleteConfirmRefs.current = { ...showDeleteConfirmRefs.current, [document.id]: ref }}
                        className="w-8 h-8 ml-5 relative"
                        color="red"
                        buttonType="outline"
                        ripple="dark"
                        iconOnly={true}
                        aria-label="Delete this document"
                        onClick={() => setShowDeleteConfirm(document.id)}>
                        <Icon name="delete" />
                    </Button>
                    <Tooltip
                        className='flex w-full items-center justify-between !shadow-xl px-3'
                        style={{
                            minWidth: isSmallScreen() ? `${docListWidth - 100}px` : `calc(${docListWidth}px / 2)`,
                            y: -3
                        }}
                        referenceElement={showDeleteConfirmRefs.current[document.id]}
                        show={showDeleteConfirm === document.id}
                        placement='left'
                        fallbackPlacements={['left']}
                        offset={[0, 10]}
                        customVariants={deleteTooltipVariants}
                    >
                        <span className="text-xs">Are you sure?</span>
                        <div className="flex gap-1">
                            <Button
                                color='red'
                                className='!text-[10px]! py-0 !px-2 !normal-case h-6 sm:h-7'
                                iconOnly={isSmallScreen()}
                                onClick={() => {
                                    setShowDeleteConfirm(false)
                                    setTimeout(() => deleteDoc(document.id), 1000)
                                }}>
                                {!isSmallScreen() && <span>Delete</span>}
                                <Icon name='done' />
                            </Button>
                            <Button
                                color='gray'
                                iconOnly={isSmallScreen()}
                                className='!text-[10px]! py-0 !px-2 !normal-case h-6 sm:h-7'
                                onClick={() => setShowDeleteConfirm(false)}>
                                {!isSmallScreen() && <span>Cancel</span>}
                                <Icon name='close' />
                            </Button>
                        </div>
                    </Tooltip>
                </motion.div>
                <AlertCustom color='red' setTrigger={setDeleted} show={deleted}>
                    {deleted.msg}
                </AlertCustom>
            </motion.li>
        )
    }) || []

    return (
        <section className='font-[Poppins] max-w-3xl mx-auto p-4 sm:!p-10 text-sm text-gray-500'>
            <header className='flex items-center justify-between xs:px-5'>
                <div className="flex items-center">
                    <h2 className='font-medium mr-2'>My documents</h2>
                    <Button
                        className={`w-6 h-6 !cursor-pointer`}
                        rounded={true}
                        color="transparent"
                        disabled={docs.length <= 2}
                        buttonType="outline"
                        ripple="dark"
                        iconOnly={true}
                        aria-label='Collapse list'
                        onClick={() => setItemsCount(2)}
                    >
                        <Icon name='expand_less' size="xl" color='gray' />
                    </Button>
                </div>
                <div className="flex relative items-center justify-center">
                    <Button
                        ref={arrangeDropdownBtn}
                        className="w-8 h-8 "
                        color="transparent"
                        buttonType="outline"
                        ripple="dark"
                        iconOnly={true}
                        aria-label='Sort by date'
                        onClick={() => setShowArrDropdown(prev => !prev)}
                    >
                        <Icon name='sort' size="xl" color='gray' />
                    </Button>
                    <AnimatePresence>
                        {showArrDropdown &&
                            <motion.div
                                ref={arrangeDropdown}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute flex flex-col top-[35px] right-0 shadow-xl border-2 border-solid border-gray-200 rounded-md bg-gray-100 z-50">
                                {
                                    arrBtns.map(arrBtn => {
                                        return <Button
                                            onClick={() => {
                                                setSort({ by: arrBtn.by, direction: arrBtn.direction })
                                                setShowArrDropdown(false)
                                            }}
                                            key={arrBtn.description + '-' + arrBtn.direction}
                                            data-arrange-by={arrBtn.by}
                                            data-arrange-direction={arrBtn.direction}
                                            className="arr-btn" >{`${arrBtn.description}${arrBtn.by !== 'filename' ? `(${arrBtn.direction.toUpperCase()})` : ''}`}</Button>

                                    })
                                }
                            </motion.div>}
                    </AnimatePresence>
                </div>
            </header>
            <motion.section layout transition={{ duration: 0.2 }}>
                <motion.ul
                    ref={docListRef}
                    layout
                    transition={{ duration: 0.2 }}
                    className={`overflow-hidden scrollbar-thin scrollbar-rounded hover:scrollbar-thumb-gray-500 scrollbar-thumb-transparent list-none mt-5 xs:px-5`}>
                    <AnimatePresence>
                        <LayoutGroup inherit>
                            {docs}
                            {(docs.length === 0 && docsLoading) &&
                                <motion.div {...loadVariants} className="flex items-center justify-center w-full h-full">
                                    <InfinityLoader className="w-20 h-20" />
                                </motion.div>}
                            {(docs.length === 0 && !docsLoading) && <motion.p {...loadVariants} className="text-center py-5 italic text-sm text-gray-300">No documents</motion.p>}
                        </LayoutGroup>
                    </AnimatePresence>
                </motion.ul>
            </motion.section>
            <motion.div layout>
                <Button
                    className={`ml-5 mt-5 mr-auto h-6 px-1 ${!noMoreDocs && 'border'} !p-4 border-1 border-gray-300 disabled:bg-gray-200 disabled:text-white disabled:hover:bg-gray-200 disabled:hover:text-white`}
                    color='gray'
                    ref={showMoreBtnRef}
                    disabled={noMoreDocs}
                    buttonType='link'
                    onClick={() => {
                        setItemsCount(prev => prev + 2)
                    }}
                >
                    Show More
                    <Icon name='add' />
                </Button>
            </motion.div>
        </section >
    )
}

export default DocList
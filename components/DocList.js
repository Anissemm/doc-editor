import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { db } from "../firebase"
import { useCollection } from 'react-firebase-hooks/firestore'
import Time from '../components/TimeAgo'
import Link from 'next/link'
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import InfinityLoader from "../assets/svg/InfinityLoader"
import isEqual from "lodash.isequal"
import dynamic from "next/dynamic"
import { Icon, Button } from "@material-tailwind/react"

const AlertCustom = dynamic(import("../components/Alert"), { ssr: false })

const loadVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
}

const DocList = () => {
    const { data: session } = useSession()
    const [sort, setSort] = useState('asc')
    const [itemsCount, setItemsCount] = useState(2)
    const [noMoreDocs, setNoMoreDocs] = useState(false)
    const [deleted, setDeleted] = useState({ status: false, msg: 'void' })
    const [onShowMore, setShowMore] = useState(null)

    const showMoreBtnRef = useRef(null)

    const firestoreQuery = db.collection('userDocs').doc(session.user?.email).collection('docs')

    const [documents, docsLoading] = useCollection(firestoreQuery.orderBy('modifiedAt', 'desc').limit(itemsCount))

    const deleteDoc = async (e) => {
        setDeleted({ status: false, msg: 'Deleting...' })

        const { docId } = e.target.closest('li').dataset
        try {
            if (docId) {
                const { filename } = documents?.docs.find(doc => doc.id === docId).data()
                await firestoreQuery.doc(docId).delete()
                setDeleted({ status: true, msg: `File "${filename}" was deleted!` })
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (documents) {
            const { docs } = documents
            const data = docs?.map(doc => doc.data())

            firestoreQuery.orderBy('modifiedAt', 'desc').get().then((temp) => {
                const tempData = temp?.docs.map(snapshot => snapshot.data())

                if (isEqual(data, tempData)) {
                    return setNoMoreDocs(true)
                }
                setShowMore(true)
                setNoMoreDocs(false)
            })
        }
    }, [documents])

    let docs = documents?.docs.map((document) => {
        const data = document.data()

        return (
            <motion.li
                layout
                data-doc-id={document.id}
                className="flex !h-min-[50px] items-center justify-center my-1 border px-1.5 py-2 font-medium rounded border-1 border-gray-200 hover:bg-gray-50 transition"
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
                        <span className="truncate max-w-[100px] sm:max-w-[300px]">{data.filename}</span>
                        <Time className='text-gray-500 font-normal text-[10px]' date={data.modifiedAt ? data.modifiedAt.toMillis() : Date.now()} />
                    </a>
                </Link>
                <Button
                    className="w-8 h-8 ml-5"
                    color="red"
                    buttonType="outline"
                    ripple="dark"
                    iconOnly={true}
                    aria-label="Delete this document"
                    onClick={(e) => {

                        deleteDoc(e)
                    }}>
                    <Icon name="delete" />
                </Button>
                <AlertCustom color='red' setTrigger={setDeleted} show={deleted}>
                    {deleted.msg}
                </AlertCustom>
            </motion.li>
        )
    }) || []

    return (
        <section className='max-w-3xl mx-auto p-10 text-sm text-gray-500'>
            <header className='flex items-center justify-between px-5'>
                <div className="flex items-center">
                    <h2 className='font-medium mr-2'>Latest documents</h2>
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
                <div className="flex items-center justify-center">
                    <Button
                        className="w-8 h-8 "
                        color="transparent"
                        buttonType="outline"
                        ripple="dark"
                        iconOnly={true}
                        aria-label='Sort by date'
                        onClick={() => {
                            if (sort === 'desc') {
                                setSort('asc')
                            } else {
                                setSort('desc')
                            }
                        }}
                    >
                        <Icon name='sort' size="xl" color='gray' />
                    </Button>
                </div>
            </header>
            <motion.section layout transition={{ duration: 0.2 }}>
                <motion.ul
                    layout
                    transition={{ duration: 0.2 }}
                    className={`overflow-hidden scrollbar-thin scrollbar-rounded hover:scrollbar-thumb-gray-500 scrollbar-thumb-transparent list-none mt-5 px-5`}>
                    <AnimatePresence>
                        <LayoutGroup inherit key={'doc-list'}>
                            {sort === 'asc' ? docs : docs.reverse()}
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
        </section>
    )
}

export default DocList
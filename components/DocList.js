import { useState, useRef, useEffect, forwardRef } from "react"
import { useSession } from "next-auth/react"
import { db } from "../firebase"
import { useCollection } from 'react-firebase-hooks/firestore'
import Time from '../components/TimeAgo'
import Link from 'next/link'
import Button from '@material-tailwind/react/Button'
import Icon from '@material-tailwind/react/Icon'
import { AnimatePresence, LayoutGroup, motion, Reorder } from "framer-motion"
import InfinityLoader from "../assets/svg/InfinityLoader"

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

    const firestoreQuery = db.collection('userDocs').doc(session.user?.email).collection('docs')

    const [documents, docsLoading] = useCollection(firestoreQuery.orderBy('modifiedAt', 'desc').limit(itemsCount))

    const deleteDoc = async (e) => {
        const { docId } = e.target.closest('li').dataset
        try {
            if (docId) {
                await firestoreQuery.doc(docId).delete()
            }
        } catch (err) {
            console.log(err)
        }
    }

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
                    onClick={deleteDoc}
                >
                    <Icon name="delete" />
                </Button>
            </motion.li>
        )
    }) || []

    return (
        <section className='max-w-3xl mx-auto p-10 text-sm text-gray-500'>
            <header className='flex items-center justify-between px-5'>
                <h2 className='font-medium'>Latest documents</h2>
                <div className="flex items-center justify-center">
                    <Button
                        className="w-8 h-8"
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
                <motion.ul layout transition={{ duration: 0.2 }} className={`list-none overflow-y-hidden max-h-[500px] mt-5 px-5`}>
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
                    // className={`ml-5 mt-5 mr-auto h-6 px-1 ${!noMoreDocs.current && 'border'} !p-4 border-1 border-gray-300 disabled:bg-gray-200 disabled:text-white disabled:hover:bg-gray-200 disabled:hover:text-white`}
                    color='gray'
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
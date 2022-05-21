import { useState } from "react"
import { useSession } from "next-auth/react"
import { db } from "../firebase"
import { useCollection } from 'react-firebase-hooks/firestore'
import Time from '../components/TimeAgo'
import Link from 'next/link'
import Button from '@material-tailwind/react/Button'
import Icon from '@material-tailwind/react/Icon'
import { AnimatePresence, motion } from "framer-motion"

const DocList = () => {
    const { data: session } = useSession()
    const firestoreQuery = db.collection('userDocs').doc(session.user?.email).collection('docs')
    const [snapshot] = useCollection(firestoreQuery.orderBy('createdAt'))
    const [sort, setSort] = useState('desc')

    const deleteDoc = async (e) => {
        const { docId } = e.target.closest('li').dataset
        try {
            if (docId) {
                console.log(docId)
                await firestoreQuery.doc(docId).delete()
            }
        } catch (err) {
            console.log(err)
        }
    }


    let documents = snapshot?.docs.map(document => {
        const data = document.data()
        return (
            <motion.li
                data-doc-id={document.id}
                className="flex items-center justify-center my-5"
                key={document.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <Link href={`/doc/${document.id}`}>
                    <a className='flex items-center grow justify-between w-full text-gray-700 mb-1 text-[11px]'>
                        {data.filename}
                        <Time className='text-gray-500 font-normal text-[10px]' date={data.createdAt ? data.createdAt.toMillis() : Date.now()} />
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
                    <Icon name="delete" className="pointer-events-none"/>
                </Button>
            </motion.li>
        )
    }) || []

    return (
        <section className='max-w-3xl mx-auto p-10 text-sm text-gray-700'>
            <header className='flex items-center justify-between px-5'>
                <h2 className='font-medium flex-grow'>My Documents</h2>
                <div>
                    <Button
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
                        <Icon name='sort' size="2xl" color='gray' />
                    </Button>
                </div>
            </header>
            <section>
                <ul className='list-none mt-5 px-5'>
                    <AnimatePresence>
                        {sort === 'asc' ? documents : documents.reverse()}
                    </AnimatePresence>
                </ul>
            </section>
        </section>
    )
}

export default DocList
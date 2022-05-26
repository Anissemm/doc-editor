import React, { useEffect, useState } from 'react'
import { getSession, useSession } from "next-auth/react"
import Login from '../../components/Login'
import { useDocumentData } from "react-firebase-hooks/firestore"
import { db } from "../../firebase"
import { useRouter } from "next/router"
import Logo from '../../assets/svg/logo'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Icon from '@material-tailwind/react/Icon'
import dynamic from 'next/dynamic'

const TextEditor = dynamic(() => import('../../components/TextEditor'), {ssr: false})

const Doc = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { id } = router.query
    const [filename, setFilename] = useState('')
    const query = db.collection('userDocs').doc(session?.user?.email).collection('docs').doc(id)
    const [document, loadingSnapshot] = useDocumentData(query)

    useEffect(() => {
        setFilename(document?.filename)
    }, [document])

    useEffect(() => {
        if (filename) {
            query.update({
                filename
            })
        }
    }, [filename])


    const handleNameChange = (e) => {
        if (e.target.textContent === '') {
            return setFilename('Untitled')
        }
        setFilename(e.target.textContent)
    }


    if (status === 'unauthenticated' || status === 'loading') return <Login />
    return (
        <div className='bg-[#F8F9FA]'>
            <header className='py-3 flex items-center sticky top-0 z-50 px-5 shadow-md bg-white'>
                <div className='flex justify-between items-center text-gray-800'>
                    <Link href='/'>
                        <Logo className='cursor-pointer w-6 h-6 fill-blue-700' />
                    </Link>
                    <div className='ml-2 sm:ml-5'>
                        <motion.h2 className='flex items-center justify-between text-md ml-2 font-medium' aria-label={filename}>
                            <motion.span
                                className='py-1 px-2 border-1 border-gray-400 outline-1 outline-gray-100 transition duration-1000'
                                name="filename"
                                role="textbox"
                                contentEditable={true}
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
                                {filename}
                            </motion.span>
                            <Icon name="edit" color='gray' size='xs' />
                        </motion.h2>
                    </div>
                </div>
            </header>

            <TextEditor docId={id} />

        </div>
    )
}

export default Doc

export const getServerSideProps = async (context) => {
    const session = await getSession(context)

    return {
        props: {
            session
        }
    }
}
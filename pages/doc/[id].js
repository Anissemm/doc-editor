import React from 'react'
import { getSession, useSession } from "next-auth/react"
import Login from '../../components/Login'
import dynamic from 'next/dynamic'

const EditorHeader = dynamic(() => import('../../components/EditorHeader'), { ssr: false })
const TextEditor = dynamic(() => import('../../components/TextEditor'), { ssr: false })

const Doc = () => {
    const { data: session, status } = useSession()

    if (status === 'unauthenticated' || status === 'loading') return <Login />

    return (
        <div className='bg-[#F8F9FA]'>
            <EditorHeader userEmail={session?.user?.email} />
            <TextEditor />
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
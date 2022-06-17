import { useState } from 'react'
import { getSession, useSession } from "next-auth/react"
import Login from '../../components/Login'
import dynamic from 'next/dynamic'
import Delta from 'quill-delta'
import Head from 'next/head'

const EditorHeader = dynamic(() => import('../../components/EditorHeader'), { ssr: false })
const TextEditor = dynamic(() => import('../../components/TextEditor'), { ssr: false })
import EditorProvider from '../../Providers/EditorProvider'
import { db } from '../../firebase'

const Doc = () => {
    const { data: session, status } = useSession()

    if (status === 'unauthenticated' || status === 'loading') return <Login />

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.6" media="print" />
                <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.6/dist/themes/oldstyle.min.css" media="print" />
            </Head>
            <EditorProvider session={session}>
                <div className='main-container bg-[#F8F9FA]'>
                    <EditorHeader userEmail={session?.user?.email} />
                    <TextEditor />
                </div>
            </EditorProvider>
        </>
    )
}

export default Doc

export const getServerSideProps = async (context) => {
    const { id } = context.params
    const session = await getSession(context)

    const doc = await db.collection('userDocs')
        .doc(session?.user?.email)
        .collection('docs')
        .doc(id)
        .get()

    if (!doc.exists) {
        return {
            redirect: {
                destination: '/?redirect=unexisting_doc_error',
                permanent: false,
              },
        }
    }

    return {
        props: {
            session
        }
    }
}
import { useState } from 'react'
import { getSession, useSession } from "next-auth/react"
import Login from '../../components/Login'
import dynamic from 'next/dynamic'
import Delta from 'quill-delta'
import Head from 'next/head'



const EditorHeader = dynamic(() => import('../../components/EditorHeader'), { ssr: false })
const TextEditor = dynamic(() => import('../../components/TextEditor'), { ssr: false })

const Doc = () => {
    const { data: session, status } = useSession()
    const [contents, setContents] = useState(new Delta([]))
    const [quillMounted, setQuillMounted] = useState(false)


    if (status === 'unauthenticated' || status === 'loading') return <Login />

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.6" media="print" />
                <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.6/dist/themes/oldstyle.min.css" media="print" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
                
            </Head>
            <div className='main-container bg-[#F8F9FA]'>
                <EditorHeader quillMounted={quillMounted} contents={contents} userEmail={session?.user?.email} />
                <TextEditor setQuillMounted={setQuillMounted} quillMounted={quillMounted} setContents={setContents} />
            </div>
        </>
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
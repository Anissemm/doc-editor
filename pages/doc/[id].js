import { useContext } from 'react'
import { getSession, useSession } from "next-auth/react"
import Login from '../../components/Login'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { db } from '../../firebase'

const EditorHeader = dynamic(() => import('../../components/EditorHeader'), { ssr: false })
const TextEditor = dynamic(() => import('../../components/TextEditor'), { ssr: false })

const Doc = () => {
    const { data: session, status } = useSession()
    const [filename, _setFilename] = useContext(EditorContext).useFilename

    if (status === 'unauthenticated' || status === 'loading') return <Login />

    return (
        <>
                <Head>
                    <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.6" media="print" />
                    <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.6/dist/themes/oldstyle.min.css" media="print" />
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
                    <title>{filename} | Infinity Editor</title>
                </Head>
                <div className='main-container bg-[#F8F9FA]'>
                    <EditorHeader userEmail={session?.user?.email} />
                    <TextEditor />
                </div>
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
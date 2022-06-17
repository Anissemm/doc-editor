import { useEffect } from 'react'
import Delta from 'quill-delta'
import { useState, createContext } from 'react'
import { db } from '../firebase'
import { useRouter } from 'next/router'
import { query } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useSession } from 'next-auth/react'


const defaultContextValues = {
    useContents: [new Delta(), () => { }],
    useQuillState: [false, () => { }],
    useDocumentLayout: [{}, () => { }]

}

let defaultLayout = {
    margins: {
        vertical: 1,
        horizontal: 1,
    },
    orientation: 'portrait'
}

export const EditorContext = createContext(defaultContextValues)

const EditorProvider = ({ children }) => {
    const { data: session } = useSession()
    const router = useRouter()

    const useContents = useState(new Delta([]))
    const useFilename = useState('')
    const useQuillState = useState(false)
    const useDocumentLayout = useState(defaultLayout)
    const query = db.collection('userDocs').doc(session?.user?.email).collection('docs').doc(router.query.id)

    const [document] = useDocumentData(query)

    useEffect(() => {
        if (document?.layout) {
            useDocumentLayout[1](document?.layout)
        }
    }, [document?.layout])
    

    const editorValue = {
        useContents,
        useQuillState,
        useDocumentLayout,
        useFilename
    }

    return (
        <EditorContext.Provider value={editorValue}>
            {children}
        </EditorContext.Provider>
    )
}

export default EditorProvider
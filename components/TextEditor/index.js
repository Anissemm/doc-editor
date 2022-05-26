import { useMemo, useState, useCallback, useEffect } from 'react'
import { createEditor } from 'slate'
import { Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { db } from '../../firebase'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Toolbar from './components/toolbar'
import EditableWithDecorator from './components/EditableWithDecorator'

const TextEditor = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const { id } = router.query
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
 

    const query = db.collection('userDocs')
        .doc(session?.user.email)
        .collection('docs')
        .doc(id)


    const [data] = useDocumentData(query)

    const initialValueBlank = [{ type: 'paragraph', children: [{ text: 'Type your text here...' }] }]

    const initialValue = useMemo(() => (data?.content && JSON.parse(data.content)), [data?.content]) || initialValueBlank

    if (typeof data?.content !== 'string') return


    const handleChange = (contentValue) => {
        const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
        )
        const content = JSON.stringify(contentValue)

        if (isAstChange) {
            query.set({ content }, { merge: true })
        }
    }

    return (
        <Slate
            editor={editor}
            value={initialValue}
            onChange={handleChange}
        >
            <Toolbar />
            <EditableWithDecorator />
        </Slate>
    )
}

export default TextEditor
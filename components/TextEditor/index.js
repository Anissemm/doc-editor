import { useMemo, useState, useCallback, useEffect } from 'react'
import { createEditor } from 'slate'
import { Slate, withReact, Editable } from 'slate-react'
import { withHistory } from 'slate-history'
import { db } from '../../firebase'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import isHotkey from 'is-hotkey'
import { HOTKEYS } from './constants'
import Element from './components/Element'
import Leaf from './components/Leaf'
import { toggleMark } from './functions'
import Toolbar from './components/toolbar'

const TextEditor = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const { id } = router.query
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
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
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                className=' bg-white mx-auto my-10 md:w-[210mm] md:h-[297mm] md:min-h-0 min-h-full shadow-2xl'
                spellCheck
                placeholder='Type your text here...'
                onKeyDown={event => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event)) {
                            event.preventDefault()
                            const mark = HOTKEYS[hotkey]
                            toggleMark(editor, mark)
                        }
                    }
                }}
            />
        </Slate>
    )
}

export default TextEditor
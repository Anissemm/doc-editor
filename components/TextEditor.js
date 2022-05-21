import { useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { Slate, withReact, Editable } from 'slate-react'
import { withHistory } from 'slate-history'

const TextEditor = ({ docId }) => {
    const editor = useMemo(() => withReact(withHistory(createEditor())), [])
    const [value, setValue] = useState([
        {
            children: [{ text: 'Here your initial text' }]
        }
    ])
    return (
            <Slate editor={editor} value={value} setValue={setValue}>
                <Editable />
            </Slate>
    )
}

export default TextEditor
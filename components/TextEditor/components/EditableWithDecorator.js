import Leaf from "./Leaf"
import Element from "./Element"
import { Editor, Text, Range } from "slate"
import { useSlate, Editable } from "slate-react"
import { useState, useCallback, useEffect } from 'react'
import isHotkey from "is-hotkey"
import { HOTKEYS } from "../constants"
import { toggleMark } from "../functions"

const EditableWithDecorator = () => {
    const editor = useSlate()
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const [lastActiveSelection, setLastActiveSelection] = useState()

    const decorate = (props) => {
        if (
            Text.isText(props.node) &&
            editor.selection == null &&
            lastActiveSelection != null
        ) {
            // const intersection = Range.intersection(lastActiveSelection, Editor.range(editor, props.path))

            // if (intersection == null) {
            //     return []
            // }

            const range = {
                highlighted: true,
                ...lastActiveSelection
            };
            
            return [range]
        }
        return [];
    }

    useEffect(() => {
        if (editor.selection != null) setLastActiveSelection(editor.selection)
    }, [editor.selection])

    return (
        <Editable
            decorate={decorate}
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
    )
}

export default EditableWithDecorator
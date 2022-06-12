import { useEffect, useContext } from 'react'
import { EditorContext } from '../Providers/EditorProvider'


const useQuillHistory = (quill) => {
    const [quillMounted, _setQuillMounted] = useContext(EditorContext).useQuillState

    useEffect(() => {
        if (quillMounted) {
            const redoBtn = document.querySelector('.ql-redo')
            const undoBtn = document.querySelector('.ql-undo')

            const handleUndo = () => {
                quill.getContents()
                quill.history.undo()
            }

            const handleRedo = () => {
                quill.history.redo()
            }

            undoBtn.addEventListener('click', handleUndo)
            redoBtn.addEventListener('click', handleRedo)

            return () => {

                undoBtn.removeEventListener('click', handleUndo)
                redoBtn.removeEventListener('click', handleRedo)
            }
        }
    }, [quillMounted])
}

export default useQuillHistory
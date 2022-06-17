import { useLayoutEffect, useContext } from "react"
import { EditorContext } from "../Providers/EditorProvider"

const useDocumentLayoutUpdate = () => {
    const editorCtx = useContext(EditorContext)
    const [quillMounted, _setQuillMounted] = editorCtx.useQuillState
    const [documentLayout, setDocumentLayout] = editorCtx.useDocumentLayout

    useLayoutEffect(() => {
        if (quillMounted) {

            const styles = document.createElement('style')
            const editorContainer = document.querySelector('.ql-editor')
            const mainContainer = document.querySelector('.ql-container')
            const styleNode = mainContainer.querySelector('style')

            if (styleNode) styleNode.remove()

            styles.innerHTML = `
         .ql-editor {
             padding: ${documentLayout.margins.vertical}cm ${documentLayout.margins.horizontal}cm;
             ${documentLayout.orientation == 'portrait' ?
                    `max-width: 210mm !important;
            min-height: 297mm !important;` :
                    `max-width: 297mm !important;
            min-height: 210mm !important;`
                }
         }
        `
            if (documentLayout.orientation == 'landscape') editorContainer.classList.add('landscape')
            
            editorContainer.classList.remove('landscape')
            editorContainer.before(styles)
        }
    }, [documentLayout, quillMounted])
}

export default useDocumentLayoutUpdate
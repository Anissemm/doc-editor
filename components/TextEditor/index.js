import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { useCallback } from "react"

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }], t
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
];

const TextEditor = () => {
    const wrapperRef = useCallback((editorSection) => {
        if (editorSection === null) return
        editorSection.innerHTML = ''
        const editorWrapper = document.createElement('div')
        editorSection.append(editorWrapper)
        new Quill(editorWrapper, {
            theme: 'snow', modules: {
                toolbar: toolbarOptions
            }
        })
    })

    return (
        <section ref={wrapperRef}></section>
    )
}

export default TextEditor
import Quill from "quill"
import HTMLtoDOCX from 'html-to-docx-buffer'
import FileSaver from 'file-saver'

export const registerAttributors = ({ fontSizes, align}) => {
    const FontSizeStyleAttributor = Quill.import('attributors/style/size')
    const AlignStyleAttributor = Quill.import('attributors/style/align')
    const BackgroundStyleAttributor = Quill.import('attributors/style/background')
    const ColorStyleAttributor = Quill.import('attributors/style/color')
    const FontStyleAttributor = Quill.import('attributors/style/font')

    FontSizeStyleAttributor.whitelist = fontSizes
    
    Quill.register(FontSizeStyleAttributor, true)
    Quill.register(AlignStyleAttributor, true)
    Quill.register(BackgroundStyleAttributor, true)
    Quill.register(ColorStyleAttributor, true)
    Quill.register(FontStyleAttributor, true)
    
    console.log(Quill.imports)
}

export const downloadFile = async (filename) => {
    const htmlString = document.querySelector('.ql-editor').innerHTML
    const blob = await HTMLtoDOCX(htmlString);
    FileSaver.saveAs(blob, `${filename}.docx`)
}

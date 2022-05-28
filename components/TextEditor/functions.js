import Quill from "quill"
import HTMLtoDOCX from 'html-to-docx-buffer'
import FileSaver from 'file-saver'

export const registerFontSizes = (fontSizes) => {
    const FontSize = Quill.import('formats/size')
    FontSize.whitelist = fontSizes
    Quill.register(FontSize, true)
}

export const downloadFile = async (filename) => {
    const htmlString = document.querySelector('.ql-editor').innerHTML
   const blob = await HTMLtoDOCX(htmlString);
   FileSaver.saveAs(blob, `${filename}.docx`)
}


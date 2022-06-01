import Quill from "quill"
import HTMLtoDOCX from 'html-to-docx-buffer'
import FileSaver from 'file-saver'

const redoIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 48 48" ><path d="M19.6 38Q14.85 38 11.425 
                    34.8Q8 31.6 8 26.9Q8 22.2 11.425 19Q14.85 15.8 19.6 15.8H34.3L28.6 10.1L30.7 8L40 17.3L30.7 26.6L28.6 24.5L34.3 
                    18.8H19.55Q16.05 18.8 13.525 21.125Q11 23.45 11 26.9Q11 30.35 13.525 32.675Q16.05 35 19.55 35H34V38Z"/>
                    </svg>`
                    
const undoIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 48 48"><path d="M28.4 38H14V35H28.45Q31.95 35 34.475 
                    32.675Q37 30.35 37 26.9Q37 23.45 34.475 21.125Q31.95 18.8 28.45 18.8H13.7L19.4 24.5L17.3 26.6L8 17.3L17.3 8L19.4 
                    10.1L13.7 15.8H28.4Q33.15 15.8 36.575 19Q40 22.2 40 26.9Q40 31.6 36.575 34.8Q33.15 38 28.4 38Z"/>
                    </svg>`

export const registerAttributors = ({ fontSizes, align}) => {
    const FontSizeStyleAttributor = Quill.import('attributors/style/size')
    const AlignStyleAttributor = Quill.import('attributors/style/align')
    const BackgroundStyleAttributor = Quill.import('attributors/style/background')
    const ColorStyleAttributor = Quill.import('attributors/style/color')
    const FontStyleAttributor = Quill.import('attributors/style/font')
    const QuillIcons = Quill.import('ui/icons')
    
    QuillIcons['redo'] = redoIcon
    QuillIcons['undo'] = undoIcon
    FontSizeStyleAttributor.whitelist = fontSizes
    
    Quill.register(QuillIcons, true)
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

export const setRedo = (value) => {
    console.log(this.quill)
}

export const setUndo = (value) => {
    console.log(value)
}

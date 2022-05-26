import Quill from "quill"

export const registerFontSizes = (fontSizes) => {
    const FontSize = Quill.import('formats/size')
    FontSize.whitelist = fontSizes
    Quill.register(FontSize, true)
}
import { forwardRef, useEffect, useState } from "react"
import { useSlate } from "slate-react"
import { toggleFontSize } from "../functions"
import { Input } from "@material-tailwind/react"
import { Editor } from "slate"

const defaultSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 30, 36, 48, 60, 72]
const onlyNum = /^\d*$/

const FontSelect = forwardRef(({ format }, ref) => {
    const editor = useSlate()
    const [value, setValue] = useState('16')

    useEffect(() => {
        Editor.addMark(editor, 'fontSize', value)
    }, [value])


    useEffect(() => {
        const marks = Editor.marks(editor)
        if (marks?.fontSize) {
           setValue(marks.fontSize)
        }
    }, [editor.selection])

    return (
        <>
            <Input
                className='!h-10 !w-20'
                placeholder='size'
                outline={true}
                ref={ref}
                type="text"
                list="fontSize"
                value={value}
                onFocus={e => {
                    e.target.value = null
                    e.target.placeholder = value
                }}
                onBlur={e => e.target.value = value}
                onChange={e => {
                    e.preventDefault()
                    const currentValue = e.target.value
                    currentValue = onlyNum.test(currentValue) && parseInt(currentValue) < 200 ? currentValue
                        : currentValue === '' ? value
                            : value
                    setValue(currentValue)
                }}
            />
            <datalist
                onClick={e => {
                    e.target.value = null
                    e.target.placeholder = value
                }}
                id="fontSize">
                {defaultSizes.map((item) => {
                    return (
                        <option key={item}>{item}</option>
                    )
                })}
            </datalist>
        </>
    )
})

export default FontSelect 
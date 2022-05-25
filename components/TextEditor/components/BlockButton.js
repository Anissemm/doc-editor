import { Icon, Button } from "@material-tailwind/react"
import { useSlate } from "slate-react"
import { isBlockActive, toggleBlock } from "../functions"
import { TEXT_ALIGN_TYPES } from "../constants"

const BlockButton = ({ format, icon }) => {
    const editor = useSlate()
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )

    return (
        <Button
            ripple='dark'
            iconOnly={true}
            color={isActive ? 'gray' : 'transparent'}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            <Icon name={icon} color={isActive ? 'white' : 'gray'} />
        </Button>
    )
}

export default BlockButton
import { Icon, Button } from '@material-tailwind/react'
import { useSlate } from 'slate-react'
import { isMarkActive, toggleMark } from '../functions'

const MarkButton = ({ format, icon }) => {
    const editor = useSlate()
    const isActive = isMarkActive(editor, format)

    return (
        <Button
            color={isActive ? 'gray' : 'transparent'}
            ripple='dark'
            title={format}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <Icon name={icon} color={isActive ? 'white' : 'gray'} />
        </Button>
    )
}

export default MarkButton
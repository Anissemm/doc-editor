import { useContext } from "react"
import { downloadFile } from "./functions"
import Button from "@material-tailwind/react/Button"
import Icon from "@material-tailwind/react/Icon"
import { EditorContext } from "../../Providers/EditorProvider"

const convertCmToTwip = (value) => {
    return Math.round(value * 566.9291338583)
}

const FileButtons = ({ filename }) => {
    const [documentLayout, setDocumentLayout] = useContext(EditorContext).useDocumentLayout



    const DOCX_OPTIONS = {
        orientation: documentLayout.orientation,
        margins: {
            top: `${documentLayout.margins.vertical}cm`,
            bottom: `${documentLayout.margins.vertical}cm`,
            left: `${documentLayout.margins.horizontal}cm`,
            right: `${documentLayout.margins.horizontal}cm`,
        }
    }

    return (
        <>
            <Button
                size="sm"
                color="gray"
                title='Print'
                aria-label="Print"
                onClick={() => {
                    window.print()
                }}
            >
                Print
                <Icon name="print" />
            </Button>
            <Button
                size="sm"
                color="gray"
                onClick={() => {
                    downloadFile(filename, DOCX_OPTIONS)
                }}
                title="Download file"
                aria-label="Download File"
            >
                Download
                <Icon name="save" />
            </Button>
        </>
    )
}

export default FileButtons
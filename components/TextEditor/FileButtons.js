import { useContext } from "react"
import { downloadFile } from "./functions"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { Button, Icon } from "@material-tailwind/react"
import { EditorContext } from "../../Providers/EditorProvider"

const convertCmToTwip = (value) => {
    return Math.round(value * 566.9291338583)
}

const FileButtons = ({ filename }) => {
    const [documentLayout, setDocumentLayout] = useContext(EditorContext).useDocumentLayout



    const DOCX_OPTIONS = {
        orientation: documentLayout.orientation,
        // margins: {
        //     top: convertCmToTwip(documentLayout.margins.vertical),
        //     bottom: convertCmToTwip(documentLayout.margins.vertical),
        //     left: convertCmToTwip(documentLayout.margins.horizontal),
        //     right: convertCmToTwip(documentLayout.margins.horizontal),
        // }
    }

    console.log(DOCX_OPTIONS)
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
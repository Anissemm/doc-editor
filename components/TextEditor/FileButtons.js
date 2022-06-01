import { downloadFile } from "./functions"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { Button, Icon } from "@material-tailwind/react"

const FileButtons = () => {

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
                    downloadFile(filename)
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
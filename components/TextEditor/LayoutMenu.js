import { motion } from "framer-motion"
import { useContext, useEffect, useState } from "react"
import { EditorContext } from "../../Providers/EditorProvider"
import Switcher from "../Switcher"
import MarginInput from "./MarginInput"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { db } from "../../firebase"

const LayoutMenu = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const query = db.collection('userDocs').doc(session?.user?.email).collection('docs').doc(router.query.id)

    const [documentLayout, setDocumentLayout] = useContext(EditorContext).useDocumentLayout
    const [orientation, setOrientation] = useState(documentLayout?.orientation)

    useEffect(() => {
        setDocumentLayout({
            ...documentLayout,
            orientation
        })
        query.set({
            layout: {
                orientation
            }
        }, { merge: true })

    }, [orientation])

    return (
        <>
            <motion.div className="px-2 max-w-20 flex items-center justify-center gap-2">
                <h4 id="margins" className="text-sm bold italic text-gray-700 underline decoration-2 decoration-blue-500 !text-[12px]" >Margins(cm):</h4>
                <div className="flex justify-center gap-3 items-center">
                    <MarginInput
                        type='vertical'
                        id="vertical-margin"
                        label="Vertical margin"
                        postfix="mm"
                    />
                    <MarginInput
                        type="horizontal"
                        id="horizontal-margin"
                        label="Horizontal margin"
                        postfix="mm" />
                </div>
            </motion.div>
            <div className="w-[1px] rounded-xl bg-gray-400 h-4 hidden xs:!block" ></div>
            <motion.div className="mt-1 sm:!mt-auto px-2 flex items-center justify-center gap-2">
                <h4 id="margins" className="text-sm bold italic text-gray-700 underline decoration-2 decoration-blue-500 !text-[12px]" >Orientation:</h4>
                <Switcher
                    defaultValue={orientation}
                    setValue={setOrientation}
                    firstId='protrait'
                    firstValue='portrait'
                    firstLabel='Portrait'
                    secondId='landscape'
                    secondValue='landscape'
                    secondLabel='Landscape'
                />
            </motion.div>
        </>
    )
}

export default LayoutMenu
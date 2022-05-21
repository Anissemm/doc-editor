import React, { useState, useEffect, useRef } from "react"
import Modal from "@material-tailwind/react/Modal"
import ModalBody from "@material-tailwind/react/ModalBody"
import ModalFooter from "@material-tailwind/react/ModalFooter"
import Button from "@material-tailwind/react/Button"
import Input from "@material-tailwind/react/Input"
import { serverTimestamp } from "firebase/firestore"
import { db } from '../firebase'
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import useUntitledDocsLength from "../hooks/useUntitledDocsLength"

export default function CreateDocModal({ show, setShow }) {
    const { data: session } = useSession()
    const router = useRouter()
    const [docName, setDocName] = useState('')
    const [documentId, setDocumentId] = useState(null)
    const query = db.collection('userDocs').doc(session.user?.email).collection('docs')
    const untitledDocsLength = useUntitledDocsLength(session)

    const createDocument = async (name) => {

        if (db) {
            const doc = await query.add({
                filename: name ? name : `Untitled_${untitledDocsLength}`,
                createdAt: serverTimestamp(),
            })

            setDocumentId(doc.id)
            setShow(false)
            setDocName('')
        }
    }

    useEffect(() => {
        if (documentId) {
            router.push(`/doc/${documentId}`)
        }
    }, [documentId])

    return (
        <>
            <Modal size="sm" active={show} toggler={() => setShow(false)}>
                <h3 className="sr-only">Create New Document</h3>
                <ModalBody>
                    <Input
                        type="text"
                        color="gray"
                        size="sm"
                        value={docName}
                        outline={true}
                        placeholder="Document name"
                        onChange={(e) => setDocName(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        size="sm"
                        color="red"
                        buttonType="link"
                        ripple="dark"
                        onClick={() => {
                            setDocName('')
                            setShow(false)
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="green"
                        size="sm"
                        ripple="light"
                        onClick={() => {
                            createDocument(docName)
                        }}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
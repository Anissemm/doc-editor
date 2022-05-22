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
import { AnimatePresence, motion } from 'framer-motion'

export default function CreateDocModal({ show, setShow }) {
    const { data: session } = useSession()
    const router = useRouter()
    const [docName, setDocName] = useState('')
    const [documentId, setDocumentId] = useState(null)
    const query = db.collection('userDocs').doc(session.user?.email).collection('docs')
    const untitledDocsLength = useUntitledDocsLength(session)
    const [loading, setLoading] = useState(false)

    const createDocument = async (name) => {
        if (db) {
            setLoading(true)
            const doc = await query.add({
                filename: name ? name : `Untitled_${untitledDocsLength + 1}`,
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
        <div>
            <AnimatePresence>
                {loading &&
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-screen h-screen bg-gray-400 z-[51]"
                    />
                }
            </AnimatePresence>
            <Modal
                size="sm"
                active={show}
                toggler={() => setShow(false)}
                onBlur={() => {
                    setShow(false)
                    setDocName('')
                }}>
                <h3 className="sr-only">Create New Document</h3>
                <ModalBody>
                    <Input
                        type="text"
                        color="gray"
                        size="sm"
                        disabled={loading}
                        value={docName}
                        outline={true}
                        placeholder="Document name"
                        onChange={(e) => setDocName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                createDocument(docName)
                            }
                        }}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        size="sm"
                        color="red"
                        buttonType="link"
                        ripple="dark"
                        disabled={loading}
                        onClick={() => {
                            setShow(false)
                            setDocName('')
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="green"
                        size="sm"
                        ripple="light"
                        disabled={loading}
                        onClick={() => {
                            createDocument(docName)
                        }}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
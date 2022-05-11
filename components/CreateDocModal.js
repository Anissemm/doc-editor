import React, { useState } from "react"
import Modal from "@material-tailwind/react/Modal"
import ModalBody from "@material-tailwind/react/ModalBody"
import ModalFooter from "@material-tailwind/react/ModalFooter"
import Button from "@material-tailwind/react/Button"
import Input from "@material-tailwind/react/Input"
import { doc, collection, setDoc, serverTimestamp, } from "firebase/firestore"
import { db } from '../firebase'
import { useSession } from "next-auth/react"

export default function CreateDocModal({ show, setShow }) {
    const { data: session } = useSession()

    const [docName, setDocName] = useState()

    const createDocument = async (name) => {
        if (!name) return
        if (db) {
            const col = collection(db, 'userDocs')
            const user = doc(col, session.user.email)
            const document = doc(collection(user, 'docs'))
            await setDoc(document, {
                filename: name,
                createdAt: serverTimestamp()
            })
            
        }
        setShow(false)
        setDocName('')
    }

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
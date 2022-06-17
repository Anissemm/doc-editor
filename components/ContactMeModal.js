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
import { Checkbox } from "@material-tailwind/react"
import { motion, AnimatePresence } from 'framer-motion'
import { Formik } from "formik"
import * as yup from 'yup'

export default function CreateDocModal({ show, setShow }) {
    const { data: session } = useSession()
    const router = useRouter()

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
                size="lg"
                active={show}
                toggler={() => setShow(false)}
                onBlur={() => {
                    setShow(false)
                }}>
                <h3 className="sr-only">Contact me for further information</h3>
                <ModalBody>
                   
                </ModalBody>
                <ModalFooter>
                    <Button
                        size="sm"
                        color="red"
                        buttonType="link"
                        ripple="dark"
                        onClick={() => {
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
                            
                        }}
                    >
                        Send
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
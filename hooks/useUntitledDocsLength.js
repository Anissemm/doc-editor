import { db } from "../firebase"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { connectFirestoreEmulator } from "firebase/firestore"

const useUntitledDocsCount = (session) => {
   const query = db.collection('userDocs').doc(session.user?.email).collection('docs')
   const [docs] = useCollectionData(query)
   const untitledDocsCount = docs?.map(doc => {
                           const match = doc.filename.match(/^Untitled_(\d+)$/)
                           if (match) {
                              return parseInt(match[1])
                           } 
                        }).filter(untitled => untitled)

   const count = Math.max(...untitledDocsCount || [])

   return count === -Infinity ? 0 : count
}

export default useUntitledDocsCount
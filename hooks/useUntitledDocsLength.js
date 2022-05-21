import { db } from "../firebase"
import { useCollectionData } from "react-firebase-hooks/firestore"

const useUntitledDocsLength = (session) => {
   const query = db.collection('userDocs').doc(session.user?.email).collection('docs')
   const [docs] = useCollectionData(query)
   while (docs) {
      const filteredDocs = docs?.filter(doc => doc.filename.startsWith('Untitled'))
      return filteredDocs.length
   }
}

export default useUntitledDocsLength
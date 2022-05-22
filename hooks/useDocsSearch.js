import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { db } from '../firebase'

const useSearch = () => {
    const { data: session } = useSession()
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)

    return {
        loading,
        getResults: () => {
            return {
                results,
                statusMessage: results ? 'Successfully loaded!' : 'No Result',
                status: results ? 'ok' : 'no-data'
            }
        },
        handleSearch: async (e) => {
            if (e.target.value.length > 3) {
                setLoading(true)
                const docsSnapshot = await db.collection('userDocs').doc(session?.user.email).collection('docs').get()
                const docs = docsSnapshot?.docs.map(doc => {
                    return {...doc.data(), id: doc.id}
                })
                setResults(docs)
                setLoading(false)
            }
        }
    }
}

export default useSearch;
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { db } from '../firebase'

const useSearch = () => {
    const { data: session } = useSession()
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [endQuery, setEndQuery] = useState(false)
    const [isCleanInput, setIsCleanInput] = useState(true)

    return {
        isCleanInput,
        endQuery,
        loading,
        getResults: () => {
            return {
                results,
                statusMessage: results.length > 0 ? 'Successfully loaded!' : 'No Result',
                status: results.length > 0 ? 'success' : 'no-data'
            }
        },
        handleSearch: async (e) => {
            setEndQuery(false)

            const query = e.target.value
            const regexp = new RegExp(query, 'i')

            if (query.length === 0) return setIsCleanInput(true)

            if (query.length > 0) {
                setIsCleanInput(false)
                setLoading(true)
                const docsSnapshot = await db.collection('userDocs').doc(session?.user.email).collection('docs').get()
                const docs = docsSnapshot?.docs.reduce((results, doc) => {
                    const data = doc.data()
                    if (regexp.test(data?.filename)) {
                        results.push({ ...data, id: doc.id })
                    }
                    return results
                }, [])
                setResults(docs)
                setLoading(false)
                setEndQuery(true)
            }
        }
    }
}

export default useSearch;
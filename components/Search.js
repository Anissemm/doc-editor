import { useState } from 'react'
import useSearch from "../hooks/useDocsSearch"
import Icon from '@material-tailwind/react/Icon'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

const variants = {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
}

const Search = () => {
    const { handleSearch, getResults, loading: searchLoading } = useSearch()
    const { results } = getResults()
    const [focused, setFocused] = useState(false)

    return (
        <>
            <div
                tabIndex='1'
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className='flex relative flex-grow items-center mx-5 px-4 py-0.5 z-2 bg-gray-100 rounded-md md:mx-20 text-gray-400 focus-within:shadow-md  focus-within:z-50 focus-within:bg-gray-100 focus-within:text-gray-500 transition-all'>
                <Icon name="search" color="gray-400" size="2xl" />
                <input
                    type='search'
                    placeholder='Search'
                    onChange={handleSearch}
                    className='pl-4 focused:fixed pr-1 w-full p-2 outline-none bg-transparent'

                />
            </div>
            <AnimatePresence>
                {focused &&
                    <motion.section
                        className='fixed pt-[85px] px-24 z-49 top-0 left-0 w-screen h-screen bg-slate-700 bg-opacity-80 px'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} >
                        <motion.header>
                            <motion.h3 {...variants} className='text-2xl text-gray-100 underline decoration-2'>
                                RESULTS:
                            </motion.h3>
                        </motion.header>
                        <motion.ul
                            className='mx-auto max-w-2xl bg-slate-700 bg-opacity-50'>
                            {results?.map(result => {
                                console.log(result)
                                return (<motion.li key={result.id}>
                                    <Link href={`/doc/${result.id}`}>
                                        <a>
                                            {result.filename}
                                        </a>
                                    </Link>
                                </motion.li>)
                            })}
                        </motion.ul>
                    </motion.section>
                }
            </AnimatePresence>
        </>
    )
}

export default Search 
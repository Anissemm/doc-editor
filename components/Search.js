import { useState } from 'react'
import useSearch from "../hooks/useDocsSearch"
import Icon from '@material-tailwind/react/Icon'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import DocIcon from '../public/svg/DocSvg'

const scaleVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
}

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
}

const Search = () => {
    const { handleSearch, getResults, loading: searchLoading, endQuery, isCleanInput } = useSearch()
    const { results } = getResults()
    const [focused, setFocused] = useState(false)

    return (
        <>
            <div
                tabIndex={1}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className='flex font-[Poppins] relative flex-grow items-center mx-5 px-4 py-0.5 z-2 bg-gray-100 rounded-md md:mx-20 text-gray-400 focus-within:shadow-md  focus-within:z-50 focus-within:bg-gray-100 focus-within:text-gray-500 transition-all'>
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
                        {...fadeVariants}
                        className='fixed font-[Poppins] pt-[85px] px-3 sm:!px-16 z-49 top-0 left-0 w-screen h-screen bg-slate-700 bg-opacity-80 px'
                    >
                        {!isCleanInput &&
                            <AnimatePresence>
                                <motion.div {...fadeVariants} className='scrollbar-thin scrollbar-thumb-t scrollbar-thumb-gray-400 mx-auto max-w-4xl h-[80%] overflow-scroll bg-slate-700 bg-opacity-50 p-10 shadow-md'>
                                    <h3 className='sr-only'>RESULTS:</h3>
                                    <motion.ul>
                                        {(results.length && results?.map(result => {
                                            return (
                                                <motion.li {...scaleVariants} key={result.id}>
                                                    <Link href={`/doc/${result.id}`}>
                                                        <a className="flex items-center rounded shadow-sm break-words overflow-y-auto flex-wrap text-gray-700 font-medium text-sm bg-gray-100 ml-4 mb-4 p-5 hover:shadow-xl hover:bg-gray-200 cursor-pointer">
                                                            <DocIcon className="w-14 mr-3" />
                                                            <span className='pr-10'>{result.filename}</span>
                                                        </a>
                                                    </Link>
                                                </motion.li>
                                            )
                                        })) ||
                                            (results?.length === 0 && endQuery &&
                                                (<motion.div
                                                    className='flex justify-center items-center text-gray-100'
                                                    {...scaleVariants}>
                                                    No Result
                                                </motion.div>)
                                            ) ||
                                            (searchLoading &&
                                                (<motion.div
                                                    className='flex justify-center items-center text-gray-100'
                                                    {...scaleVariants}>
                                                    Loading...
                                                </motion.div>)
                                            )
                                        }
                                    </motion.ul>
                                </motion.div>
                            </AnimatePresence>
                        }
                    </motion.section>
                }
            </AnimatePresence>
        </>
    )
}

export default Search 
import { getSession, useSession } from 'next-auth/react'
import Search from '../components/Search'
import Logo from './Logo'

import { useEffect, useRef, useState } from 'react'
import { customSignOut } from './Login'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@material-tailwind/react'

const Header = () => {
    const { data: session } = useSession()
    const [showAccountSettings, setShowAccountSettings] = useState(false)
    const accountMenuRef = useRef(null)
    const imageRef = useRef(null)

    useEffect(() => {
        const handleOuterClick = (e) => {
            if (e.target !== imageRef.current) {
                if (e.target.closest('[data-account-menu]') == accountMenuRef.current) {
                    setShowAccountSettings(true)
                } else {
                    setShowAccountSettings(false)
                }
            }
        }

        document.addEventListener('click', handleOuterClick, false)

        return () => {
            document.removeEventListener('click', handleOuterClick, false)
        }

    }, [])

    return (
        <header className='py-3 flex items-center sticky top-0 z-50 px-5 shadow-md bg-white'>
            <div className="flex items-center">
                <Logo />
            </div>
            <Search />
            <div
                ref={accountMenuRef}
                data-account-menu
                className='accountMenu flex-shrink-0 only:flex relative items-center'
            >
                <AnimatePresence>
                    {showAccountSettings && <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 'auto' }}
                        exit={{ width: 0 }}
                        className='absolute flex justify-center items-center flex-col top-[140%] right-1 bg-gray-200 shadow-2xl rounded-xl p-2 min-h-[200px] min-w-[200px]'
                    >
                        <motion.img
                            width={64}
                            height={64}
                            className={`cursor-pointer relative rounded-full ml-2 hover:shadow-md 
                    focus:shadow-md transition-all`}
                            src={session.user?.image}
                            alt="Profile image"
                        />
                        <h3 className='text-gray-600 my-3'>
                            {session.user?.name}
                        </h3>
                        <Button
                            color='gray'
                            onClick={customSignOut}>
                            Sign out
                        </Button>
                    </motion.div>}
                </AnimatePresence>
                <motion.img
                    width={showAccountSettings ? 35 : 32}
                    height={showAccountSettings ? 35 : 32}
                    className={`cursor-pointer relative rounded-full ml-2 hover:shadow-md 
                    focus:shadow-md transition-all ${showAccountSettings ? 'z-10 left-10' : ''}}`}
                    src={session.user?.image}
                    alt="Profile image"
                    ref={imageRef}
                    onClick={() => { setShowAccountSettings(prev => !prev) }}
                />
            </div>
        </header>
    )
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context)

    return {
        props: {
            session
        }
    }
}

export default Header
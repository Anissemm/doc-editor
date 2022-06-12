import { getSession, signOut, useSession } from 'next-auth/react'
import Search from '../components/Search'
import Logo from './Logo'
import { motion } from 'framer-motion'
import Tooltip from './Tooltip'
import { useState } from 'react'

const Header = () => {
    const { data: session } = useSession()

    return (
        <header className='py-3 flex items-center sticky top-0 z-50 px-5 shadow-md bg-white'>
            <div className="flex items-center">
            <Logo />
            </div>
            <Search />
            <div className='flex relative items-center'>
                <motion.img
                    width={32}
                    height={32}
                    className='cursor-pointer rounded-full ml-2 hover:shadow-md focus:shadow-md transition-all'
                    src={session.user?.image}
                    alt="Profile image"
                    onClick={() => {
                        signOut()
                    }}
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
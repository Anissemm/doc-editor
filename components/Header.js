import Button from '@material-tailwind/react/Button'
import Icon from '@material-tailwind/react/Icon'
import { getSession, signOut, useSession } from 'next-auth/react'
import Logo from '../assets/svg/logo'
import Search from '../components/Search'

const Header = () => {
    const { data: session } = useSession()


    return (
        <header className='py-3 flex items-center sticky top-0 z-50 px-5 shadow-md bg-white'>
            <div className="flex items-center">
                <h1 className='flex items-center'>
                    <Logo className='w-8 h-8 fill-blue-700' />
                    <span className='pl-2 text-gray-700 text-xl'>TEditor</span>
                </h1>
            </div>
            <Search />
            <div className='flex items-center'>
                <Button
                    className='border-0'
                    color="gray"
                    buttonType="outline"
                    rounded={true}
                    iconOnly={true}
                    ripple="dark"
                    aria-label="Menu toggle"
                >
                    <Icon name="apps" size="2xl" />
                </Button>
                <img
                    className='cursor-pointer h-8 w-8 rounded-full ml-2 hover:shadow-md focus:shadow-md transition-all'
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
import Button from '@material-tailwind/react/Button'
import Icon from '@material-tailwind/react/Icon'

const Header = () => {
    return (
        <header className='py-3 flex items-center sticky top-0 z-50 px-5 shadow-md bg-white'>
            <div className="flex items-center">
                <Button
                    className='border-0 mr-2'
                    color="gray"
                    buttonType="outline"
                    rounded={true}
                    iconOnly={true}
                    ripple="dark"
                    aria-label="Menu toggle"
                >
                    <Icon name="menu" size="2xl" />
                </Button>
                <h1 className='flex items-center'>
                    <Icon className="mx-5 block" name="description" color="blue" size="3xl" />
                    <span className='pl-2 text-gray-700 text-xl'>Docs</span>
                </h1>
            </div>
            <div className='flex flex-grow items-center mx-5 px-4 py-0.5 bg-gray-100 rounded-md md:mx-20 text-gray-400 focus-within:shadow-md focus-within:text-gray-600 transition-all'>
                <Icon name="search" color="gray-400" size="2xl" />
                <input type='search' placeholder='Search' className='pl-4 pr-1 flex-grow p-2 outline-none bg-transparent' />
            </div>
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
                    className='cursor-pointer h-10 w-10 rounded-full ml-2 hover:shadow-md focus:shadow-md transition-all'
                    src="https://i.ibb.co/X8K83SG/Profil-crop.png"
                    alt="Profile image"
                />
                
            </div>
        </header>
    )
}

export default Header
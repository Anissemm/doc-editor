import React from 'react'

const OrBar = () => {
    return (
        <div className='flex items-center w-[210px]'>
            <div className='h-[1px] w-full grow bg-white shadow-sm'></div>
            <div className='grow-0 px-2'>Or</div>
            <div className='h-[1px]  w-full grow bg-white shadow-sm'></div>
        </div>
    )
}

export default OrBar
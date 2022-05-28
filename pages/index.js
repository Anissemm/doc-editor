import { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Button from '@material-tailwind/react/Button'
import Icon from '@material-tailwind/react/Icon'
import { useSession, getSession } from 'next-auth/react'
import Login from '../components/Login'
import DocList from '../components/DocList'
import dynamic from 'next/dynamic'

const CreateDocModal = dynamic(() => import('../components/CreateDocModal'), { ssr: false })

export default function Home() {
  const { data: _session, status } = useSession()
  const [showCreateDocModal, setCreateDocShowModal] = useState(false);
  const [docAdded, setDocAdded] = useState(false)

  if (status === 'unauthenticated' || status === 'loading') return <Login />

  return (
    <div>
      <Head>
        <title>Document Editor</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <section>
        <div className='max-w-3xl mx-auto bg-[#F8F9FA] px-10'>
          <div className='flex items-center justify-between py-6'>
            <h2 className='text-gray-700'>Start a new document</h2>
            <Button
              iconOnly={true}
              buttonType='outline'
              color='gray'
              aria-label='Blank'
              className='mr-auto ml-3 focus:outline-none bg-transparent h-6 w-6 relative border-2 cursor-pointer transition-all duration-150'
              onClick={() => {
                setCreateDocShowModal(true)
              }}>
              <Icon name='add' />
            </Button>
          </div>
        </div>
      </section>
      <DocList />
      <CreateDocModal  show={showCreateDocModal} setShow={setCreateDocShowModal} />
    </div>
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
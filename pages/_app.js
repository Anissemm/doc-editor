import '../styles/globals.css'
import '@material-tailwind/react/tailwind.css'
import '../styles/styles.css'



import { SessionProvider } from "next-auth/react"
import EditorProvider from '../Providers/EditorProvider'

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <EditorProvider session={session}>
        <Component {...pageProps} />
      </EditorProvider>
    </SessionProvider>
  )

}

export default MyApp

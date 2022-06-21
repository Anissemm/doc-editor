import '../styles/globals.css'
import '@material-tailwind/react/tailwind.css'
import '../styles/styles.css'
import { SessionProvider } from "next-auth/react"

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
  )

}

export default MyApp

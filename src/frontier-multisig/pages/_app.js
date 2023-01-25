import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="">
        <p className="">Frontier Multisig</p>
        <div className="">
          <Link href="/">
              Home
          </Link>
          <Link href="/about">
              About us
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>    
      <main className={`${styles.main} rounded-lg`}>
          <div className='md:columns-2 text-white' style={{height: '50%'}}>
            <div className='column'>
              <h1 className='text-4xl font-bold '>Hello World!</h1>
              <p className='text-xl'>Hola mundo!</p>
              </div>
              <div className='column'>
              <h1 className='text-4xl font-bold'>Hello World!</h1>
              <p className='text-xl'>Hola mundo!</p>
              </div>
          </div><div className='md:columns-2 text-white'  style={{height: '50%'}}>
            <div className='column'>
            <h1 className='text-4xl font-bold'>Hello World!</h1>
              <p className='text-xl'>Hola mundo!</p>
              </div>
              <div className='column'>
              <h1 className='text-4xl font-bold'>Hello World!</h1>
              <p className='text-xl'>Hola mundo!</p>
              </div>
          </div>
      </main>
    </>
  )
}

import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })


function IndexPage({ currentPage }) {
  return (
   <main className={`${styles.main} rounded-lg`}>
      {currentPage === 'page1' ? (
        
        <div className='bg-green-400'>
          <p>Your current balance is $123.03</p>
        </div>

      ) : null}
      {currentPage === 'page2' ? (

        <div className='bg-white'>
          <p>This is the content of page 2.</p>
        </div>

      ) : null}
      {currentPage === 'page3' ? (
        
        <div className='bg-red-500'>
          <p>This is the content of page 3.</p>
        </div>

      ) : null}
    </main>
  );
}

IndexPage.getInitialProps = async ({ query }) => {
  const initialPage = query.page || 'page1';
  return { initialPage };
};

export default IndexPage;

// export default function Home() {
//   return (
//     <>    
//       <main className={`${styles.main} rounded-lg`}>
//           <div className='md:columns-2 text-white' style={{height: '50%'}}>
//             <div className='column'>
//               <h1 className='text-4xl font-bold '>Hello World!</h1>
//               <p className='text-xl'>Hola mundo!</p>
//               </div>
//               <div className='column'>
//               <h1 className='text-4xl font-bold'>Hello World!</h1>
//               <p className='text-xl'>Hola mundo!</p>
//               </div>
//           </div><div className='md:columns-2 text-white'  style={{height: '50%'}}>
//             <div className='column'>
//             <h1 className='text-4xl font-bold'>Hello World!</h1>
//               <p className='text-xl'>Hola mundo!</p>
//               </div>
//               <div className='column'>
//               <h1 className='text-4xl font-bold'>Hello World!</h1>
//               <button>
//                 <a href='./index2'>Google</a>
//               </button>
//               <p className='text-xl'>Hola mundo!</p>
//               </div>
//           </div>
//       </main>
//     </>
//   )
// }

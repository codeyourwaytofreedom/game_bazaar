import Head from 'next/head';
import Homie from '../components/Homie';

export default function Home() {
  return (
    <>
      <Head>
        <title>Game Bazaar</title>
        <meta name="description" content="developed by ECK" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/swords.png" />
      </Head>
      <main>
        <Homie/>
      </main>
    </>
  )
}

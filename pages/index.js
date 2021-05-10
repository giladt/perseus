import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useState, useEffect, useRef } from "react"

const RICK_AND_MORTY_API = {
  CHARACTERS_URI: 'https://rickandmortyapi.com/api/character',
  EPISODES_URI: 'https://rickandmortyapi.com/api/episode',
  LOCATIONS_URI: 'https://rickandmortyapi.com/api/location',
}

const handleGetEpisodes = async ( ref ) => {
  const character = ref.currentTarget.id
  const character_episodes = await ( await fetch( `${ RICK_AND_MORTY_API.CHARACTERS_URI }/${ character }` ) ).json()

  const episodes = character_episodes.episode.map( async ( episode ) => {
    return await ( await ( await fetch( episode ) ).json() )
  } )

  console.log( episodes )
  return await episodes
}

export default function Home ( { data } ) {

  const [ characters, setCharacters ] = useState( [] )
  const [ episodes, setEpisodes ] = useState( [] )

  const ref = useRef( null )

  if ( !data ) return <div>Loading...</div>
  useEffect( () => {
    setCharacters( data.results )
  }, [] )

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Rick and Morty Episode selector
        </h1>

        <p className={styles.description}>
          Get started by selecting your favorite character
        </p>

        <section className={ styles.grid }>
          { characters.map( ( character ) => {
            return (
              <div key={ character.id } ref={ ref } id={ character.id } className={ styles.card } onClick={ async ( e ) => setEpisodes( await handleGetEpisodes( e ) ) }>
                <img className={ styles.logo } src={ character.image } alt={ character.name } />
                { character.name }
              </div>
            )
          } ) }
        </section>
        <section className={ `${ styles.grid } ${ styles.episodes }` }>
          { episodes?.results?.length > 0 && episodes.results.map( ( episode ) => {
            return (
              <div key={ episode.id } className={ styles.card }>
                <h1>{ episode.name }</h1>
                <b>{ episode.air_date }</b>
                <p>{ episode.episode }</p>
              </div>
            )
          } ) }

        </section>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.perseus.de/en/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Coding Challenge made by Gilad Tsabr, for{ ' ' }
          <span className={styles.logo}>
            <Image src="/perseus.svg" alt="Perseus Logo" width={ 72 } height={ 16 } />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps ( context ) {
  const res = await fetch( RICK_AND_MORTY_API.CHARACTERS_URI )
  const data = await res.json()

  if ( !data ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: { data },
  }
}

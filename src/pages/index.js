import Head from 'next/head';
import Image from 'next/image';
import {
  ApolloClient,
  InMemoryCache,
  gql
} from '@apollo/client';

import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss'

// import products from '@data/products.json';

export default function Home({ products }) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <Container>
          <h1>Pokemon Trading Cards</h1>
          <h2>Available Cards</h2>
          <ul className={styles.products}>
            {
              products.map(product => {
                const {
                  slug,
                  cardTitle,
                  cardDescription,
                  cardPrice,
                  cardImage
                } = product;

                return (
                  <li key={slug}>
                    <Image width={cardImage.mediaDetails.width} height={cardImage.mediaDetails.height} src={cardImage.mediaItemUrl} alt={cardImage.altText} />
                    <h3 className={styles.productTitle}>
                      {cardTitle}
                    </h3>
                    <p className={styles.productPrice}>
                      £{cardPrice}
                      </p>
                    <p>
                      <Button>Add to Cart</Button>
                    </p>
                  </li>
                )
              })
            }
          </ul>
        </Container>
      </main>

      <footer className={styles.footer}>
        &copy; Pokemon Trading Cards, {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: process.env.GRAPHQL_ENDPOINT,
    cache: new InMemoryCache()
  });

  const response = await client.query({
    query: gql`
    query PokemonCards {
      pokemons(first: 10) {
        nodes {
          ...PokemonFields
        }
      }
    }
    
    fragment PokemonFields on Pokemon {
      slug
      cardTitle
      cardDescription
      cardPrice
      cardImage {
        mediaItemUrl
        altText
        mediaDetails {
          height
          width
        }
      }
    }
    `
  });

  const products = response.data.pokemons.nodes.map(( node ) => {
    const data = {
      ...node
    }
    return data;
  });

  return { 
    props: {
      products
    }
  }
}

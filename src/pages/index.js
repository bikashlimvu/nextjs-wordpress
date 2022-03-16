import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  ApolloClient,
  InMemoryCache,
  gql
} from '@apollo/client';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss'

// import products from '@data/products.json';

export default function Home({ products }) {
  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

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
                  <Link href={`/products/${slug}`}>
                  <a>
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
                  </a>
                  </Link>
                </li>
              )
            })
          }
        </ul>
      </Container>
      
    </Layout>
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
      pokemons {
        nodes {
          ...AllPokemonFields
        }
      }
    }
    
    fragment AllPokemonFields on Pokemon {
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

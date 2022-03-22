import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  ApolloClient,
  InMemoryCache,
  gql
} from '@apollo/client';
import Fuse from 'fuse.js';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss'

// import products from '@data/products.json';

export default function Home({ products, pokemonTypes }) {
  const [activePokemonType, setPokemonType] = useState();
  const [query, setQuery] = useState();

  let activeProducts = products;

  if ( activePokemonType ) {
    activeProducts = activeProducts.filter(({ pokemonTypes }) => {
      const pokemonIds = pokemonTypes.map(({ slug }) => slug);
      return pokemonIds.includes(activePokemonType);
    })
  }

  const fuse = new Fuse(activeProducts, {
    keys: [
      'cardTitle',
      'pokemonTypes.name'
    ]
  });

  if ( query ) {
    const results = fuse.search(query);
    // activeProducts = activeProducts.filter(({ cardTitle }) => {
    //   return cardTitle.toLowerCase().includes(query.toLowerCase());
    // })
    activeProducts = results.map(({ item }) => item);
  }

  function handleOnSearch(event) {
    const value = event.currentTarget.value;
    setQuery(value);
  }

  return (
    <Layout>
      <Head>
        <title>Pokemon Trading Cards</title>
        <meta name="description" content="Buy pokemon trading cards" />
      </Head>

      <Container>
        <h1 className="sr-only">Pokemon Trading Cards</h1>
        
        <div className={styles.discover}>
          <div className={styles.pokemonTypesList}>
            <h2>Filter by Pokemon Types</h2>
            <ul>
              {
                pokemonTypes.map(pokemonType => {
                  const isActive = pokemonType.slug == activePokemonType;
                  let pokemonTypeClassName;
                  if ( isActive ) {
                    pokemonTypeClassName = styles.pokemonTypeIsActive;
                  }
                  return(
                    <li key={pokemonType.id}>
                      <Button className={pokemonTypeClassName} color="yellow" onClick={() => setPokemonType(pokemonType.slug)}>
                        {pokemonType.name}
                        </Button>
                    </li>
                  )
                })
              }
              <li>
                  <Button className={!activePokemonType && styles.pokemonTypeIsActive} color="yellow" onClick={() => setPokemonType(undefined)}>
                    View All
                    </Button>
                </li>
            </ul>
          </div>
          <div className={styles.search}>
            <h2>Search</h2>
            <form action="">
              <input onChange={handleOnSearch} type="search" />
            </form>
          </div>
        </div>

        <h2 className="sr-only">Available Cards</h2>
        <ul className={styles.products}>
          { 
            activeProducts.map(product => {
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
                    <div className={styles.productImage}>
                      <Image width={cardImage.mediaDetails.width} height={cardImage.mediaDetails.height} src={cardImage.mediaItemUrl} alt={cardImage.altText} />
                    </div>
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
    query PokemonCardsAndPokemonTypes {
      pokemons {
        nodes {
          ...AllPokemonFields
        }
      }
      pokemonTypes {
        edges {
          node {
            id
            name
            slug
          }
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
      pokemonTypes {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    }
    `
  });

  const products = response.data.pokemons.nodes.map(( node ) => {
    const data = {
      ...node,
      pokemonTypes: node.pokemonTypes.edges.map(({ node }) => node)
    }
    return data;
  });

  const pokemonTypes = response.data.pokemonTypes.edges.map(({ node }) => node);

  return { 
    props: {
      products,
      pokemonTypes
    }
  }
}

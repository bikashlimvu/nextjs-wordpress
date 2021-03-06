import Head from 'next/head';
import Image from 'next/image';
import {
  ApolloClient,
  InMemoryCache,
  gql
} from '@apollo/client';

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Product.module.scss'

// import products from '@data/products.json';

export default function Product({ product }) {
  const {
    cardTitle,
    cardDescription,
    cardPrice,
    cardImage
  } = product;

  return (
    <Layout>
      <Head>
        <title>{ cardTitle }</title>
        <meta name="description" content={ `${cardTitle} trading card` } />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
          <Image width={cardImage.mediaDetails.width} height={cardImage.mediaDetails.height} src={cardImage.mediaItemUrl} alt={cardImage.altText} />
          </div>
          <div className={styles.productContent}>
          <h1>{ cardTitle }</h1>
            <div dangerouslySetInnerHTML={{ __html: cardDescription }} />
            <p className={styles.productPrice}>
              £{cardPrice}
              </p>
            <p>
              <Button>Add to Cart</Button>
            </p>
          </div>
        </div>
      </Container>
 
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const { productId } = params;

  const client = new ApolloClient({
    uri: process.env.GRAPHQL_ENDPOINT,
    cache: new InMemoryCache()
  });

  const response = await client.query({
    query: gql`
      query ProductById($id: ID!) {
        pokemon(id: $id, idType: DATABASE_ID) {
          ...PokemonFields
        }
      }
      
      fragment PokemonFields on Pokemon {
        databaseId
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
    `,
    variables: {
      id: productId
    }
  });

  const product = {
    ...response.data.pokemon
  }

  return { 
    props: {
      product
    }
  }
}
 
export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: process.env.GRAPHQL_ENDPOINT,
    cache: new InMemoryCache()
  });

  const response = await client.query({
    query: gql`
    query PokemonCards {
      pokemons {
        nodes {
          ...PokemonId
        }
      }
    }
    
    fragment PokemonId on Pokemon {
      slug
    }
    `
  });

  const paths = response.data.pokemons.nodes.map(( node ) => {
    return {
      params: {
        productId: node.slug
      }
    };
  });

  return {
    paths,
    fallback: false
  }
}
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { loadStripe } from '@stripe/stripe-js'
import { Button, Card, Flex, Text, useTheme, View } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import { PHASE_PRODUCTION_SERVER } from 'next/dist/shared/lib/constants'
import { useEffect, useState } from 'react'
import { listProducts } from '../src/graphql/queries'



const inter = Inter({ subsets: ['latin'] })

export default function Home() {
const [products, setProducts] = useState([])
const { tokens } = useTheme()
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await API.graphql({ query: listProducts })
        const productData = data.listProducts.items
        setProducts(productData)
      } catch (e) {
        console.error(e)
      }
    }

    fetchProducts()
  }, [])

  const handleButtonClick = async (productID) => {
    console.log(productID)
    const stripe = await loadStripe(
      'sk_test_51MNlxxGrUZ3ZkJ30G2serH0qFAC0ufj9ircfiWIaLyPJEoVXrtoYhTYUUOdqzltnKzFsIT41y7T6tdBGuDEhVXZX00mCAe0LeU'
    )
      await stripe
        .redirectToCheckout({
          lineItems: [
            {
              price: productID,
              quantity: 1,
            },
          ],
          mode: 'payment',
          successUrl: 'http://localhost:3000/',
          cancelUrl: 'http://localhost:3000/cancel',
        })
        .catch((e) => console.log(e))
    }

  return (
    <>
    <View height={'100vh'}>
      <Flex
        direction={{ base: 'column', medium: 'row' }}
        justifyContent={'center'}
        alignItems="center"
      >
        {products.map((product) => (
          <Card
            key={product.id}
            variation="elevated"
            width={['90vw', '350px']}
          >
            <View direction={'column'}>
              <Flex justifyContent={'center'} alignItems="center">
                
              </Flex>
              <Flex
                justifyContent={'space-around'}
                marginBottom={tokens.space.medium}
              >
                <Text>{product.name}</Text>
                <Text>${(product.price / 100).toFixed(2)}</Text>
              </Flex>
              <Flex justifyContent={'flex-end'}>
                <Button
                  variation="primary"
                  onClick={() => handleButtonClick(product.priceID)}
                >
                  Buy Now
                </Button>
              </Flex>
            </View>
          </Card>  
        ))}
        </Flex>  
    </View>
    </>
      
  )
}
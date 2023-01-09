import { Button, TextField, withAuthenticator } from '@aws-amplify/ui-react'
import { API, Storage} from 'aws-amplify'
import React from 'react'
import {createProduct} from '../src/graphql/mutations'
function Products({ signOut }) {
    const handleSubmit = async (e) => {
        e.preventDefault()

        const name = e.target.name.value
        const description = e.target.description.value
        const price = e.target.price.value
        
        
        try {
            const storageStuff = await Storage.put(productImage.name)
            const imageID = storageStuff.key
            console.log(imageID)
            await API.graphql({
                query: createProduct,
                variables: {
                    input: {
                        name,
                        description,
                        price,
                        
                    },
                },
            })
        }   catch (e) {
            console.log(e)
        }
    }
    return (
        <>
            <Button onClick={signOut}>Sign Out</Button>
            <form onSubmit={handleSubmit}>
                <TextField placeholder="name" name={'name'} />
                <TextField placeholder="description" name={'description'} />
                <TextField placeholder="price" name={'price'} type="number" />
                
                <Button type="submit" variation="primary">
                    Add Product
                </Button>
            </form>
        </>
    )
}

export default withAuthenticator(Products)
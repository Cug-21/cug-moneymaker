/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_CUGMONEYMAKER_PRODUCTTABLE_NAME
	API_CUGMONEYMAKER_PRODUCTTABLE_ARN
	API_CUGMONEYMAKER_GRAPHQLAPIIDOUTPUT
	STRIPE_TEST_KEY
Amplify Params - DO NOT EDIT */

const stripe = require('stripe')(process.env.STRIPE_TEST_KEY)
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()

exports.handler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const dbItem = record.dynamodb.NewImage
      try {
        const product = await stripe.products.create({
          name: dbItem.name.S,
          description: dbItem.description.S,
          id: dbItem.id.S,
        })

        const price = await stripe.prices.create({
          unit_amount: dbItem.price.N,
          currency: 'usd',
          product: product.id,
        })

        var params = {
          TableName: process.env.API_CUGMONEYMAKER_PRODUCTTABLE_NAME,
          Item: {
            ...dbItem,
            priceID: {
              S: price.id,
            },
          },
        }

        await dynamodb.putItem(params).promise()
      } catch (e) {
        console.log('uh oh ...', e)
      }
    }
  }
  return Promise.resolve('Successfully processed DynamoDb record')
}
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'

import { ReviewDomain } from '../../domain/ReviewDomain'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const reviews = await ReviewDomain.getReviews(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: reviews
      })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)

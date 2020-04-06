import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteReview')

import { ReviewDomain } from '../../domain/ReviewDomain'

import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const reviewId = event.pathParameters.reviewId
    console.log(`will delete ${reviewId}`)
    await ReviewDomain.deleteReview(getUserId(event), reviewId)

    logger.info(`deleted review`, { reviewId: reviewId })

    return {
      statusCode: 200,
      body: ''
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)

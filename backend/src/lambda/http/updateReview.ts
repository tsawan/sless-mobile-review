import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateReviewRequest } from '../../requests/UpdateReviewRequest'

import { createLogger } from '../../utils/logger'
const logger = createLogger('updateReview')

import { ReviewDomain } from '../../domain/ReviewDomain'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const reviewId = event.pathParameters.reviewId
    const updatedReview: UpdateReviewRequest = JSON.parse(event.body)

    await ReviewDomain.updateReview(getUserId(event), reviewId, updatedReview)

    logger.info(`Review updated`)

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

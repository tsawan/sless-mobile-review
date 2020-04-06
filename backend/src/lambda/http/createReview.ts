import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateReviewRequest } from '../../requests/CreateReviewRequest'

import { createLogger } from '../../utils/logger'
const logger = createLogger('createReview')

import { ReviewDomain } from '../../domain/ReviewDomain'

import { getUserId } from '../utils'
import { Review } from '../../models/Review'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const reviewRequest: CreateReviewRequest = JSON.parse(event.body)

    logger.info('Received create request')
    const userId = getUserId(event)

    const newReview: Review = await ReviewDomain.createReview(userId, reviewRequest)

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: newReview
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

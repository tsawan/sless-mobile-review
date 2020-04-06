import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getUserId } from "../utils";

import { createLogger } from "../../utils/logger";
const logger = createLogger("generateUploadUrl");

import { ReviewDomain } from '../../domain/ReviewDomain'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const reviewId = event.pathParameters.reviewId;

    const reviewExists = await ReviewDomain.reviewExists(getUserId(event), reviewId);

    logger.info(`review exists ${reviewExists}`);

    if (!reviewExists) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Review does not exist"
        })
      };
    } else {
      const result = await ReviewDomain.generateURL(getUserId(event), reviewId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...result
        })
      };
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
);

// default data layer for review dynamodb table.

import * as AWS from "aws-sdk";

const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { Review } from "../models/Review";

import { createLogger } from "../utils/logger";
import { UpdateReviewRequest } from "../requests/UpdateReviewRequest";

const logger = createLogger("reviewDao");

const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();
const reviewsTable = process.env.REVIEWS_TABLE;

export class ReviewDao {

  static async reviewExists(userId: string, reviewId: string): Promise<boolean> {
    const result = await docClient
      .get({
        TableName: reviewsTable,
        Key: {
          userId,
          reviewId
        }
      })
      .promise();

    logger.info("getReview ", !!result.Item);
    return !!result.Item;
  }

  static async getReviews(userId: string) {
    const result = await docClient
      .query({
        TableName: reviewsTable,
        KeyConditionExpression: "#userId = :i",
        ExpressionAttributeNames: {
          "#userId": "userId"
        },
        ExpressionAttributeValues: {
          ":i": userId
        }
      })
      .promise();
    return result.Items as Review[];
  }

  static async updateReview(
    userId: string,
    reviewId: string,
    updatedReview: UpdateReviewRequest
  ) {
    await docClient
      .update({
        TableName: reviewsTable,
        Key: {
          userId,
          reviewId
        },
        ExpressionAttributeNames: {
          "#D": "releasedDate",
          "#R": "review",
          "#G": "range",
          "#P": "price"
        },
        ExpressionAttributeValues: {
          ":d": updatedReview.releaseDate,
          ":r": updatedReview.review,
          ":g": updatedReview.range,
          ":p": updatedReview.price
        },
        UpdateExpression: "SET #D = :d, #R = :r, #G = :g, #P = :p",
        ReturnValues: "ALL_NEW"
      })
      .promise();
  }

  static async updateReviewUrl(userId: string, reviewId: string, url: string) {
    await docClient
      .update({
        TableName: reviewsTable,
        Key: {
          userId,
          reviewId
        },
        ExpressionAttributeNames: {
          "#D": "photoUrl"
        },
        ExpressionAttributeValues: {
          ":y": url
        },
        UpdateExpression: "SET #D = :y",
        ReturnValues: "ALL_NEW"        
      })
      .promise();
  }

  static async createReview(newReview: Review) {
    await docClient
      .put({
        TableName: reviewsTable,
        Item: newReview
      })
      .promise();

    logger.info(`Review created`);
  }

  static async deleteReview(userId: string, reviewId: string) {
    await docClient
      .delete({
        TableName: reviewsTable,
        Key: {
          userId: userId,
          reviewId: reviewId
        }
      })
      .promise();
    logger.info(`Review deleted`);
  }
}

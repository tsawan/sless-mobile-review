// review business domain

import { createLogger } from "../utils/logger";
const logger = createLogger("reviewDomain");

import { ReviewDao } from "../dao/ReviewDao";
import { ReviewPhoto } from "../dao/ReviewPhoto";
import { CreateReviewRequest } from "../requests/CreateReviewRequest";

import * as uuid from "uuid";
import { Review } from "../models/Review";
import { UpdateReviewRequest } from "../requests/UpdateReviewRequest";

export class ReviewDomain {

  static async getReviews(userId: string) {
    return await ReviewDao.getReviews(userId);
  }

  static async deleteReview(userId: string, reviewId: string) {
    await ReviewDao.deleteReview(userId, reviewId);
  }

  static async reviewExists(userId: string, reviewId: string): Promise<boolean> {
    return await ReviewDao.reviewExists(userId, reviewId);
  }

  static async updateReview(
    userId: string,
    reviewId: string,
    reviewRequest: UpdateReviewRequest
  ) {
    await ReviewDao.updateReview(userId, reviewId, reviewRequest);
  }

  static async createReview(
    userId: string,
    reviewRequest: CreateReviewRequest
  ): Promise<Review> {
    const reviewId = uuid.v4();
    const createdAt = new Date().toISOString();
    const releaseDate = new Date(reviewRequest.releaseDate).toISOString();

    const newReview: Review = {
      userId,
      reviewId,
      createdAt,
      title: reviewRequest.title,
      brand: reviewRequest.brand,
      releaseDate,
      review: reviewRequest.review,
      range: reviewRequest.range,
      price: reviewRequest.price
    };

    await ReviewDao.createReview(newReview);
    return newReview;
  }

  // photo

  static async generateURL(userId: string, reviewId: string) {
    const photoId = uuid.v4();
    const photoUrl = ReviewPhoto.getPhotoUrl(photoId);

    const url = await getSignedUrl(photoId);
    logger.info(`Generated attachment url ${url}`);

    await updateReviewUrl(userId, reviewId, photoUrl);

    return {
      uploadUrl: url
    };
  }
}

const updateReviewUrl = async (userId: string, reviewId: string, url: string) => {
  await ReviewDao.updateReviewUrl(userId, reviewId, url);
};

const getSignedUrl = async (photoId: string) => {
  return await ReviewPhoto.getSignedUrl(photoId);
};

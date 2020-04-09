import React from "react";

import { History } from "history";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import dateFormat from "dateformat";

import {
  Box,
  Stack,
  Flex,
  Grid,
  Divider,
  Image,
  useToast,
  Badge,
  Heading,
  Icon,
  IconButton,
} from "@chakra-ui/core";

import { deleteReview, getReviews, patchReview } from "../api/reviews-api";
import Auth from "../auth/Auth";
import { Review } from "../types/Review";

interface ReviewsProps {
  auth: Auth;
  history: History;
}

const flexSettings = {
  flex: "1",
  minW: "300px",
  textAlign: "center",
  color: "black",
  mx: "6",
  mb: "6",
};

const ReviewsList = (props: any) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    const _getReviews = async () => {
      try {
        const _reviews: any = await getReviews(props.auth.getIdToken());
        
        toast({
          title: "Mobile reviews loaded",
          description: "Existing mobiles reviews loaded successfully",
          status: "info",
          duration: 2000,
        });
        
        setReviews(_reviews);
        setLoading(false);
      } catch (e) {
        alert(`Failed to fetch reviews: ${e.message}`);
      }
    };
    _getReviews();
  }, []);

  const onEditButtonClick = (reviewId: string) => {
    history.push(`/reviews/${reviewId}/edit`);
  };

  const onCreateButtonClick = () => {
    history.push(`/reviews/create`);
  };

  const getToken = () => {
    return props.auth.getIdToken();
  };

  const onReviewDelete = async (reviewId: string) => {
    try {
      await deleteReview(getToken(), reviewId);
      const updatedReviews = reviews.filter(
        (review: Review) => review.reviewId != reviewId
      );
      setReviews(updatedReviews);
      toast({
        title: "Mobile review deleted",
        description: "Mobile review was deleted successfully",
        status: "success",
        duration: 2000,
      });
    } catch {
      alert("Review deletion failed");
    }
  };

  const renderReviews = () => {
    if (loading) {
      return renderLoading();
    }

    return renderReviewsList(reviews);
  };

  const renderLoading = () => {
    return <Box>Loading Reviews</Box>;
  };

  const onReviewCheck = async (pos: number) => {
    try {
      const review: Review = reviews[pos];
      await patchReview(getToken(), review.reviewId, {
        range: review.range,
        price: review.price,
        review: review.review,
      });
      //update(reviews, {[pos]: {}})
      //setReviews([]);
    } catch {
      alert("Review update failed");
    }
  };

  const renderReviewsList = (reviews: Review[]) => {
    return (
      <Grid>
        {reviews.map((review, pos) => {
          return (
            <Box key={review.reviewId}>
              <Stack isInline>
                <Box>
                  <Stack isInline>
                    <Heading fontSize="xl">{review.title}</Heading>
                    
                    <IconButton
                      aria-label="Edit"
                      icon="edit"
                      variantColor="blue"
                      onClick={() => onEditButtonClick(review.reviewId)}
                    >
                      Edit
                    </IconButton>
                    <IconButton
                      aria-label="Upload photo"
                      variantColor="green"
                      icon="attachment"
                      onClick={() => onEditButtonClick(review.reviewId)}
                    />
                    <IconButton
                      aria-label="Delete"
                      variantColor="red"
                      icon="delete"
                      onClick={() => onReviewDelete(review.reviewId)}
                    />
                  </Stack>
                  <Box>
                    Brand <b>{review.brand}</b>
                    
                  </Box>
                  <Box>
                    Released On <b>{dateFormat(review.releaseDate, "yyyy-mm-dd")}</b>
                  </Box>
                  <Box width="90%" backgroundColor="lightgoldenrodyellow">
                    <br/>{review.review}<br/><br/>
                  </Box>
                  <Box >
                    Price <b>$ {review.price}</b>  ({review.range} Range)
                  </Box>
                </Box>
                {review.photoUrl && <Image src={review.photoUrl} />}
              </Stack>
              <Divider />
            </Box>
          );
        })}
      </Grid>
    );
  };

  return (
    <div>
      <Stack isInline>
      <h1>Mobile Reviews</h1>
      <Box width="100px"></Box>
      <button 
        color="blue"
        onClick={() => onCreateButtonClick()}>Create new Review</button>
      </Stack>
      <Divider />

      {renderReviews()}
    </div>
  );
};

export default ReviewsList;

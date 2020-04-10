import React from "react";

import { History } from "history";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import dateFormat from "dateformat";
import SelectedReview from './SelectedReview';

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
  Button,
  Text
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
        toast({
          title: "Error loading",
          description: "Error loading Mobile reviews",
          status: "error",
          duration: 4000,
        });
        }
    };
    _getReviews();
  }, []);

  const onEditButtonClick = (review: Review, context:any) => {
    context.set(review);
    history.push(`/reviews/${review.reviewId}/edit`);
  };

  const onAttachButtonClick = (reviewId: string) => {
    history.push(`/reviews/${reviewId}/attach`);
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
      toast({
        title: "Delete failed",
        description: "Mobile review deletion failed",
        status: "error",
        duration: 4000,
      });
    }
  };

  const renderReviews = (context:any) => {
    if (loading) {
      return renderLoading();
    }

    return renderReviewsList(reviews, context);
  };

  const renderLoading = () => {
    return <Box>Loading Reviews</Box>;
  };

  const renderReviewsList = (reviews: Review[], context:any) => {
    return (
      <Grid>
        {reviews.map((review, pos) => {
          return (
            <Box key={review.reviewId}>
              <Stack isInline>
                <Box width="80%">
                  <Stack isInline>
                    <Heading fontSize="xl">{review.title}</Heading>
                    
                    <IconButton
                      aria-label="Edit"
                      icon="edit"
                      variantColor="blue"
                      onClick={() => onEditButtonClick(review, context)}
                    >
                      Edit
                    </IconButton>
                    <IconButton
                      aria-label="Upload photo"
                      variantColor="green"
                      icon="attachment"
                      onClick={() => onAttachButtonClick(review.reviewId)}
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
                  <Box backgroundColor="lightgoldenrodyellow">
                    <br/>{review.review}<br/><br/>
                  </Box>
                  <Box >
                    Price <b>$ {review.price}</b>  ({review.range} Range)
                  </Box>
                </Box>
                <Box width="20%">
                {review.photoUrl && <Image src={review.photoUrl} />}
                </Box>
              </Stack>
              <Divider />
            </Box>
          );
        })}
      </Grid>
    );
  };

  return (
    <SelectedReview.Consumer>
      {context => (
    <div>
      <Stack isInline>
      <h1>Mobile Reviews</h1>
      <Box width="100px"></Box>
      <Button 
        variantColor="green"
        onClick={() => onCreateButtonClick()}>Create new Review</Button>
      </Stack>
      <Divider />

      {renderReviews(context)}
    </div>
      )}
    </SelectedReview.Consumer>
  );
};

export default ReviewsList;

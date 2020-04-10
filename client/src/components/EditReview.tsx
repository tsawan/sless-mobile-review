import React from "react";

import { Formik, Field, ErrorMessage } from "formik";
import styled from "@emotion/styled";
import * as Yup from "yup";
import {
  Box,
  Flex,
  Grid,
  useToast,
  Heading,
  Button,
  Text
} from "@chakra-ui/core";
import { useHistory } from "react-router-dom";
import SelectedReview from "./SelectedReview";

import { patchReview } from "../api/reviews-api";

import { showError } from "../Utils";

import { UpdateReviewRequest } from "../types/UpdateReviewRequest";

const EditReview = (props: any) => {
  const toast = useToast();
  const history = useHistory();

  const onReviewUpdate = async (req: UpdateReviewRequest, toast: any) => {
    try {
      const newReview = await patchReview(
        getToken(),
        props.match.params.reviewId,
        req
      );
      toast({
        title: "Mobile review update",
        description: "Mobile review was updated successfully",
        status: "success",
        duration: 2000,
      });
      return newReview;
    } catch {
      toast({
        title: "Updated failed",
        description: "Mobile review update failed",
        status: "error",
        duration: 4000,
      });
    }
  };

  const getToken = () => {
    return props.auth.getIdToken();
  };

  return (
    <SelectedReview.Consumer>
      {(context: any) => (
        <div>
          <Flex>
            <Box>
              <Formik
                initialValues={{
                  title: context.review.title,
                  brand: context.review.brand,
                  review: context.review.review,
                  range: context.review.range,
                  price: context.review.price,
                }}
                validationSchema={Yup.object({
                  range: Yup.string().required("Required"),
                  price: Yup.number().positive().required("Required"),
                  review: Yup.string()
                    .min(50, "Must be 50 characters or more")
                    .required("Required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setTimeout(async () => {
                    let req: any = {};
                    req.price = parseInt(values.price.toString());
                    req.range = values.range;
                    req.review = values.review;
                    await onReviewUpdate(req, toast);

                    // update context object
                    context.review.review = values.review;
                    context.review.price = values.price;
                    context.review.range = values.range;

                    history.push(`/`);

                    //setSubmitting(false);
                  }, 400);
                }}
              >
                {({ values, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Box borderWidth="1px" rounded="lg">
                      <Grid
                        w="100%"
                        templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                        gap={2}
                      >
                        <Heading>Edit Mobile Review</Heading>

                        <Text><b>{values.title}</b></Text>
                        <label htmlFor="review">Brief Review</label>
                        <Field
                          as="textarea"
                          name="review"
                          rows="4" 
                          value={values.review}
                        />
                        <ErrorMessage name="review" render={showError} />

                        <label htmlFor="range">Range</label>
                        <Field name="range" as="select" value={values.range}>
                          <option>Low</option>
                          <option>Mid</option>
                          <option>High</option>
                        </Field>
                        <ErrorMessage name="range" render={showError} />

                        <label htmlFor="price">Price</label>
                        <Field name="price" value={values.price} />
                        <ErrorMessage name="price" render={showError} />

                        <Button type="submit" variantColor="green">Update Review</Button>
                      </Grid>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          </Flex>
        </div>
      )}
    </SelectedReview.Consumer>
  );
};

export default EditReview;

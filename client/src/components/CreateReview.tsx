import React from "react";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box, Flex, Grid, Text, useToast, Heading, Button } from "@chakra-ui/core";
import dateFormat from "dateformat";

import { createReview } from "../api/reviews-api";

import { CreateReviewRequest } from "../types/CreateReviewRequest";

import { showError } from '../Utils';

const CreateReview = (props: any) => {
  const toast = useToast();

  const onReviewCreate = async (req: CreateReviewRequest, toast: any) => {
    try {
      const newReview = await createReview(getToken(), req);
      toast({
        title: "Mobile review created",
        description: "Mobile review was created successfully",
        status: "success",
        duration: 2000,
      });
      return newReview;
    } catch {
      toast({
        title: "Create failed",
        description: "Mobile review creation failed",
        status: "error",
        duration: 4000,
      });
    }
  };

  const calculateReleaseDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);

    return dateFormat(date, "yyyy-mm-dd") as string;
  };

  const getToken = () => {
    return props.auth.getIdToken();
  };

  return (
    <div>
      <Flex>
        <Box>
          <Formik
            initialValues={{
              title: "",
              brand: "Apple",
              review: "",
              range: "Low",
              price: 0,
            }}
            validationSchema={Yup.object({
              title: Yup.string()
                .min(10, "Must be 10 characters or more")
                .required("Required"),
              brand: Yup.string().required("Required"),
              range: Yup.string().required("Required"),
              price: Yup.number().positive().required("Required"),
              review: Yup.string()
                .min(50, "Must be 50 characters or more")
                .required("Required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setTimeout(async () => {
                let req: any = {};
                req.brand = values.brand;
                req.price = parseInt(values.price.toString());
                req.range = values.range;
                req.review = values.review;
                req.title = values.title;
                req.releaseDate = calculateReleaseDate();
                await onReviewCreate(req, toast);

                resetForm({});
              }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box borderWidth="1px" rounded="lg">
                  <Grid
                    w="100%"
                    templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                    gap={2}
                  >
                    <Heading>Create new Mobile Review</Heading>
                    <label htmlFor="title">Review Title</label>
                    <Field name="title" type="text" value={values.title} />
                    <ErrorMessage name="title" render={showError} />

                    <label htmlFor="review">Brief Review</label>
                    <Field as="textarea" rows="4" name="review" value={values.review} />
                    <ErrorMessage name="review" render={showError} />

                    <label htmlFor="brand">Brand</label>
                    <Field as="select" name="brand" value={values.brand}>
                      <option>Apple</option>
                      <option>Samsung</option>
                      <option>Huawei</option>
                      <option>LG</option>
                      <option>Nokia</option>
                    </Field>
                    <ErrorMessage name="brand" render={showError} />

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

                    <Button type="submit" variantColor="green">Save Review</Button>
                  </Grid>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Flex>
    </div>
  );
};

export default CreateReview;

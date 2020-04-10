import React from 'react';
import SelectedReview from './SelectedReview';
import { useState } from "react";
import {Review} from '../types/Review';

const SelectedReviewProvider = (props:any) => {
    const [review, setReview] = useState({})
    return (
        <SelectedReview.Provider
            value={{
                review,
                set: (r:Review) => setReview(r)
            }}>
            {props.children}
        </SelectedReview.Provider>
    )
}

export default SelectedReviewProvider;
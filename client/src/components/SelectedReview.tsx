import React from 'react';
import {Review} from '../types/Review';

interface value {
    review: Review;
    set(r:Review): void
}

const SelectedReview = React.createContext({});

export default SelectedReview;
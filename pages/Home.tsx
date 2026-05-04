import React from 'react';
import { Hero } from '../components/Hero';
import { VideosOfTheWeek } from '../components/VideosOfTheWeek';
import { Services } from '../components/Services';
import { Portfolio } from '../components/Portfolio';

export const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <VideosOfTheWeek />
            <Services />
            <Portfolio />
        </>
    );
};

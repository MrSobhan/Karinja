import React from 'react';
import { Navbar } from '@/components/Navbar';
import { SectionHeader } from '@/components/SectionHeader';
import { SliderCompany } from '@/components/SliderCompany';
import { SectionBlog } from '@/components/SectionBlog';
import { SectionContact } from '@/components/SectionContact';
import { SectionFeature } from '@/components/SectionFeature';
import { Footer } from '@/components/Footer';
import { SectionInsights } from '@/components/SectionInsights';
import { SectionHero } from '@/components/SectionHero';
import { SectionBrands } from '@/components/SectionBrands';
import { SectionFAQs } from '@/components/SectionFAQs';

const HomePage = () => {
    return (
        <>
            <Navbar />
            <SectionHeader />
            <SectionInsights />
            <SliderCompany />
            <SectionHero />
            <SliderCompany />
            <SectionFeature/>
            <SectionBlog />
            <SectionContact/>
            <SectionBrands />
            <SectionFAQs />
            <Footer/>
        </>
    );
}


export default HomePage;
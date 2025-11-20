import React from 'react';
import { Navbar } from '@/components/Navbar';
import { SectionHeader } from '@/components/SectionHeader';
import { SliderCompany } from '@/components/SliderCompany';
import { SliderJobPosts } from '@/components/SliderJobPosts';
import { SectionBlog } from '@/components/SectionBlog';
import { SectionContact } from '@/components/SectionContact';
import { SectionFeature } from '@/components/SectionFeature';
import { Footer } from '@/components/Footer';
import { SectionInsights } from '@/components/SectionInsights';
import { SectionHero } from '@/components/SectionHero';
import { SectionBrands } from '@/components/SectionBrands';
import { SectionFAQs } from '@/components/SectionFAQs';

import PersianCalendar from "@/lib/PersianCalendar";

const HomePage = () => {
    document.title = "Karinja"
    const handleDateChange = (date) => {
        console.log(date.format("jYYYY/jMM/jDD"));

    }
    return (
        <>
            <Navbar />
            <SectionHeader />

            {/* <div className="w-full flex justify-center">
                <PersianCalendar onDateChange={handleDateChange} />
            </div> */}

            <SectionInsights />
            <SliderJobPosts />
            <SectionHero />
            <SliderCompany />
            <SectionFeature />
            <SectionBlog />
            <SectionContact />
            <SectionBrands />
            <SectionFAQs />
            <Footer />
        </>
    );
}


export default HomePage;
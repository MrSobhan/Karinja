import React from 'react';
import { Navbar } from '@/components/Navbar';
import { SectionHeader } from '@/components/SectionHeader';
import { SliderCompany } from '@/components/SliderCompany';
import { SectionBlog } from '@/components/SectionBlog';
import { SectionComment } from '@/components/SectionComment';
import { SectionFeature } from '@/components/SectionFeature';
import { Footer } from '@/components/Footer';

const HomePage = () => {
    return (
        <>
            <Navbar />
            <SectionHeader />
            <SliderCompany />
            <SliderCompany />
            <SectionFeature/>
            <SectionBlog />
            {/* //    -----
            // ----- -------- */}
            <SectionComment/>
            <Footer/>
        </>
    );
}


export default HomePage;
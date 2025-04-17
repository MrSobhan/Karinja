import { Navbar } from '@/components/Navbar';
import { SectionHeader } from '@/components/SectionHeader';
import { SliderCompany } from '@/components/SliderCompany';
import React from 'react';

const HomePage = () => {
    return (
        <>
            <Navbar />
            <SectionHeader />
            <SliderCompany />
        </>
    );
}


export default HomePage;
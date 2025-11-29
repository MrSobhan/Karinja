import React, { useState } from "react";
import { Button } from "./ui/button";
import { HiArrowSmLeft, HiChevronDown } from "react-icons/hi";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { JOB_CATEGORIES, IRAN_PROVINCES } from "@/constants/jobFilters";

export function SectionHeader() {
    const [open, setOpen] = useState(false);
    const [openJobCat, setOpenJobCat] = useState(false);
    const [value, setValue] = useState("");
    const [valueJobCat, setValueJobCat] = useState("");
    const [searchTitle, setSearchTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.2,
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 1.2 },
        },
        hover: {
            x: -10,
            transition: { duration: 0.3 },
        },
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTitle) params.append("title", searchTitle);
        if (valueJobCat) params.append("category", valueJobCat);
        if (value) params.append("city", value);
        navigate(`/jobs/search?${params.toString()}`);
        setLoading(false);
    };

    return (
        <div className="container relative max-w-7xl mx-auto lg:py-32 w-full flex flex-col lg:flex-row items-center justify-center mt-16">
            
            <motion.div
                className="flex lg:hidden w-full justify-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <img
                    src="/src/image/hero.png"
                    alt="کارجوی موبایل"
                    className="w-60 h-auto"
                />
            </motion.div>
            
            
            <motion.div
                className="mx-auto text-center lg:text-start"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.p
                    className="antialiased font-sans inline-flex text-xs rounded-full border-dashed border-[2.5px] border-gray-900 dark:border-gray-500 py-1 px-6 dana font-medium"
                    variants={childVariants}
                >
                    با بیش از 1000 آگهی در سراسر کشور
                </motion.p>
                <motion.p
                    className="font-bold text-2xl mt-7 md:text-4xl dark:text-white text-black dana"
                    variants={childVariants}
                >
                    <p>39,728 آگهی استخدام</p>
                   <p className="mt-3"> در 334 شهر</p>
                </motion.p>
                <motion.p
                    className="font-bold text-2xl mb-7 mt-3 md:text-4xl dark:text-white text-black dana"
                    variants={childVariants}
                >
                    شغل خودتو با <span className="moraba">کاراینجا</span> پیدا کن!
                </motion.p>
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                >
                    <Button className="dana hover:-translate-x-3 transition-all hidden lg:flex">
                        جستجوی کار <HiArrowSmLeft />
                    </Button>
                </motion.div>
            </motion.div>

            <div className="hidden lg:block ml-8 relative">
                <video
                    className="dark:hidden block w-full"
                    src="/src/image/light-world.mp4"
                    width={340}
                    height={340}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                <video
                    className="hidden dark:block w-full"
                    src="/src/image/dark-world.mp4"
                    width={340}
                    height={340}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            </div>

            <div className="lg:absolute lg:bottom-4 left-0 w-full px-3 mt-10 lg:mt-0">
                <form
                    onSubmit={handleSearch}
                    className="lg:rounded-full lg:w-[60%] px-4 py-4 lg:px-8 mx-auto lg:shadow-lg bgNavbar grid grid-cols-4 lg:flex lg:items-center lg:justify-evenly  lg:flex-nowrap gap-7 overflow-hidden pb-12 lg:pb-4 dark:border-white/[0.2] lg:border border-transparent"
                >
                    <Input
                        placeholder="عنوان شغلی یا شرکت ..."
                        type="text"
                        className="col-span-4 lg:col-span-1"
                        value={searchTitle}
                        onChange={e => setSearchTitle(e.target.value)}
                    />
                    <Popover open={openJobCat} onOpenChange={setOpenJobCat}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openJobCat}
                                className="w-full justify-between col-span-2 lg:col-span-1"
                            >
                                {valueJobCat
                                    ? JOB_CATEGORIES.find(c => c.value === valueJobCat)?.label
                                    : "گروه شغلی"}
                                <HiChevronDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="جستجو ..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>گروه شغلی پیدا نشد</CommandEmpty>
                                    <CommandGroup>
                                        {JOB_CATEGORIES.map(cat => (
                                            <CommandItem
                                                key={cat.value}
                                                value={cat.value}
                                                onSelect={currentValue => {
                                                    setValueJobCat(currentValue === valueJobCat ? "" : currentValue);
                                                    setOpenJobCat(false);
                                                }}
                                            >
                                                {cat.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between col-span-2 lg:col-span-1"
                            >
                                {value
                                    ? IRAN_PROVINCES.find(c => c.value === value)?.label
                                    : "شهر"}
                                <HiChevronDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="جستجوی شهر ..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>شهری پیدا نشد</CommandEmpty>
                                    <CommandGroup>
                                        {IRAN_PROVINCES.map(city => (
                                            <CommandItem
                                                key={city.value}
                                                value={city.value}
                                                onSelect={currentValue => {
                                                    setValue(currentValue === value ? "" : currentValue);
                                                    setOpen(false);
                                                }}
                                            >
                                                {city.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <button
                        type="submit"
                        className="rounded-full text-md w-10 h-10 !px-2.5 col-span-4 lg:col-span-1 flex items-center justify-center mx-auto bg-[#09090b] text-white cursor-pointer dark:border-white/[0.2] border border-transparent"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin" width="20" height="20">
                                <circle cx="10" cy="10" r="8" stroke="#fff" strokeWidth="2" fill="none" />
                            </svg>
                        ) : (
                            <FiSearch />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

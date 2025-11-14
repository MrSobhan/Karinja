import React, { useState, useContext } from "react";
import { Button } from "./ui/button";
import { HiArrowSmLeft, HiChevronDown } from "react-icons/hi";
import { motion } from 'motion/react';
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function SectionHeader() {
    const [open, setOpen] = useState(false)
    const [openJobCat, setOpenJobCat] = useState(false)
    const [value, setValue] = useState("")
    const [valueJobCat, setValueJobCat] = useState("")
    const frameworks = [
        {
            value: "سلام",
            label: "سلام",
        },
        {
            value: "اوکس",
            label: "اوکس",
        },
        {
            value: "باشه",
            label: "باشه",
        },
        {
            value: "شماره4",
            label: "شماره4",
        },
        {
            value: "اره",
            label: "اره",
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
                when: 'beforeChildren',
                staggerChildren: 0.2,
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 1.2 } },
        hover: {
            x: -10,
            transition: { duration: 0.3 },
        },
    };
    return (
        <div className="container relative max-w-7xl mx-auto pt-16 lg:py-32 w-full flex flex-col lg:flex-row items-center justify-center mt-16">
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
                    با بیش از 1000 ماشین در سراسر کشور
                </motion.p>
                <motion.p
                    className="font-bold text-xl mt-7 md:text-4xl dark:text-white text-black dana"
                    variants={childVariants}
                >
                    39,728 آگهی استخدام <br />
                    در 334 شهر
                </motion.p>
                <motion.p
                    className="font-bold text-xl mb-7 mt-3 md:text-4xl dark:text-white text-black dana"
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
                    loop={false}
                    onEnded={e => e.currentTarget.pause()}
                    // style={{ background: '#fff' }}
                    playsInline
                />
                <video
                    className="hidden dark:block w-full"
                    src="/src/image/dark-world.mp4"
                    width={340}
                    height={340}
                    autoPlay
                    muted
                    loop={false}
                    onEnded={e => e.currentTarget.pause()}
                    // style={{ background: '#18181b' }}
                    playsInline
                />
            </div>

            <div className="lg:absolute lg:bottom-4 lg:left-~0 w-full px-3 mt-20 lg:mt-0">

                <div className='lg:rounded-full lg:w-[60%] px-4 py-4 lg:px-8 mx-auto lg:shadow-lg bgNavbar grid grid-cols-4 lg:flex lg:items-center lg:justify-evenly  lg:flex-nowrap gap-7 overflow-hidden pb-12 lg:pb-4 dark:border-white/[0.2] lg:border border-transparent'>
                    

                    <Input placeholder="عنوان شغلی یا شرکت ..." type="text"  className="col-span-4 lg:col-span-1"/>

                    <Popover open={openJobCat} onOpenChange={setOpenJobCat}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openJobCat}
                                className="w-full justify-between col-span-2 lg:col-span-1"
                            >
                                {valueJobCat
                                    ? frameworks.find((framework) => framework.value === valueJobCat)?.label
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
                                        {frameworks.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
                                                onSelect={(currentValue) => {
                                                    setValueJobCat(currentValue === value ? "" : currentValue)
                                                    setOpenJobCat(false)
                                                }}
                                            >
                                                {framework.label}
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
                                    ? frameworks.find((framework) => framework.value === value)?.label
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
                                        {frameworks.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setOpen(false)
                                                }}
                                            >
                                                {framework.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <button className='rounded-full text-md w-10 h-10 !px-2.5 col-span-4 lg:col-span-1 flex items-center justify-center mx-auto bg-[#09090b] text-white cursor-pointer dark:border-white/[0.2] border border-transparent'><FiSearch /></button>
                </div>

            </div>
        </div>
    );
}

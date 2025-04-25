import React, { useState, useContext } from "react";
import WorldMap from "@/components/ui/world-map";
import { Button } from "./ui/button";
import { HiArrowSmLeft , HiChevronDown  } from "react-icons/hi";
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
    return (
        <div className="container relative max-w-7xl mx-auto py-32 w-full flex flex-col md:flex-row items-center justify-center mt-16">
            <div className="mx-auto text-start">
                <p class="antialiased font-sans inline-flex text-xs rounded-full border-dashed border-[2.5px] border-gray-900 dark:border-gray-500 py-1 px-6 dana font-medium">با بیش از 1000 ماشین در سراسر کشور</p>
                <p className="font-bold text-xl mt-7 md:text-4xl dark:text-white text-black dana">
                    39,728 آگهی استخدام <br />
                    در 334 شهر
                </p>
                <p className="font-bold text-xl mb-7 mt-3 md:text-4xl dark:text-white text-black dana">
                    شغل خودتو با{" "}
                    <span className="moraba text-">کاراینجا</span>
                    {" "} پیدا کن!
                </p>
                <Button className="dana hover:-translate-x-3 transition-all">جستجوی کار <HiArrowSmLeft /></Button>
            </div>
            <WorldMap
                dots={[
                    {
                        start: {
                            lat: 64.2008,
                            lng: -149.4937,
                        }, // Alaska (Fairbanks)
                        end: {
                            lat: 34.0522,
                            lng: -118.2437,
                        }, // Los Angeles
                    },
                    {
                        start: {
                            lat: 18.0,
                            lng: 60.0,
                        }, // Iran
                        end: {
                            lat: -44.0522,
                            lng: 138.2437,
                        }, // Australia
                    },
                    {
                        start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                        end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                    },
                    {
                        start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                        end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
                    },
                    {
                        start: { lat: 51.5074, lng: -0.1278 }, // London
                        end: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    },
                    {
                        start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                        end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
                    },
                    {
                        start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                        end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
                    },
                ]} />

            <div className="lg:absolute lg:bottom-4 lg:left-0 w-full px-3">

                <div className='lg:rounded-full lg:w-[60%] dark:bg-black px-4 py-4 lg:px-8 mx-auto lg:shadow-lg bgNavbar flex items-center justify-evenly gap-7 overflow-hidden flex-wrap lg:flex-nowrap pb-12 lg:pb-4 dark:border-white/[0.2] border border-transparent'>
                    <Input placeholder="عنوان شغلی یا شرکت ..." type="text" />
                    
                    <Popover open={openJobCat} onOpenChange={setOpenJobCat}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openJobCat}
                                className="w-full justify-between"
                            >
                                {valueJobCat
                                    ? frameworks.find((framework) => framework.value === valueJobCat)?.label
                                    : "گروه شغلی"}
                                <HiChevronDown  className="opacity-50" />
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
                                className="w-full justify-between"
                            >
                                {value
                                    ? frameworks.find((framework) => framework.value === value)?.label
                                    : "شهر"}
                                <HiChevronDown  className="opacity-50" />
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
                    <button className='rounded-full text-md p-2.5 bg-[#09090b] text-white cursor-pointer dark:border-white/[0.2] border border-transparent'><FiSearch /></button>
                </div>

            </div>
        </div>
    );
}

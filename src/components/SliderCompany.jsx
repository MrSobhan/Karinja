import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function SliderCompany() {
    return (
        <div className="container mx-auto my-28" >
            <Carousel className="w-full max-w-5xl mx-auto" dir="rtl"
                opts={{
                    align: "start",       // از سمت راست شروع کن
                    slidesToScroll: 4,    // هر بار ۱ اسلاید اسکرول کن
                }}>
                <CarouselContent>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <CarouselItem key={index} className="basis-1/4">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

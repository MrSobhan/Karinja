import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


const SectionFAQs = ({
    heading = "سوالات متداول کاربران",
    items = [
        {
            question: "چطور می‌تونم در سایت ثبت‌نام کنم؟",
            answer:
                "برای ثبت‌نام، روی دکمه ثبت‌نام در بالای صفحه کلیک کرده و اطلاعات خواسته شده را وارد کنید. پس از تایید ایمیل، حساب شما فعال خواهد شد.",
        },
        {
            question: "چگونه رزومه بسازم؟",
            answer:
                "بعد از ورود به پنل کاربری، از بخش «رزومه من» می‌تونید رزومه‌تون رو به صورت آنلاین بسازید یا فایل PDF آپلود کنید.",
        },
        {
            question: "آگهی‌های شغلی مورد نظرم رو از کجا پیدا کنم؟",
            answer:
                "شما می‌تونید از صفحه جستجوی شغل، براساس عنوان شغلی، شهر، سابقه کار یا نوع همکاری، فرصت‌های متناسب رو ببینید.",
        },
        {
            question: "چطور برای یک موقعیت شغلی درخواست بفرستم؟",
            answer:
                "بعد از مشاهده جزئیات هر آگهی، دکمه «ارسال رزومه» رو بزنید تا رزومه‌تون برای اون موقعیت شغلی ارسال بشه.",
        },
        {
            question: "آیا ثبت‌نام و استفاده از خدمات سایت رایگان هست؟",
            answer:
                "بله، ثبت‌نام و ارسال رزومه برای متقاضیان شغل کاملاً رایگان هست و هزینه‌ای از شما دریافت نمی‌شه.",
        },
    ],
}) => {
    return (
        <section className="py-32 container mx-auto lg:w-[80%] w-[90%]">
            <div className="text-right rtl">
                <h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-3xl moraba">
                    {heading}
                </h1>
                <Accordion type="single" collapsible>
                    {items.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="font-semibold hover:no-underline">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export { SectionFAQs };

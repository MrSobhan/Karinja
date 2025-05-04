

const SectionInsights = () => {

    let stats = [
        {
            id: "stat-1",
            value: "۳۵۰٪",
            label: "رشد ثبت‌نام کارجویان در یک سال اخیر",
        },
        {
            id: "stat-2",
            value: "۵۰۰۰+",
            label: "آگهی شغلی فعال از شرکت‌های معتبر",
        },
        {
            id: "stat-3",
            value: "۷۵٪",
            label: "افزایش رضایت کارفرماها از استخدام",
        },
        {
            id: "stat-4",
            value: "۹۸٪",
            label: "نرخ موفقیت در تطبیق رزومه با فرصت‌ها",
        },
    ]
    return (
        <section className="pb-28 pt-14 lg:py-36 container mx-auto lg:w-[80%] w-[90%]" dir="rtl">
            <div className="mt-14 grid gap-x-5 gap-y-8 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.id} className="flex flex-col gap-3 justify-center items-center">
                        <div className="text-3xl lg:text-5xl font-extrabold text-primary dana">{stat.value}</div>
                        <p className="text-muted-foreground dana text-center text-sm lg:text-lg">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export { SectionInsights };

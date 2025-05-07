import React from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const Terms = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center p-4 my-28">
                <Card className="w-full max-w-5xl shadow-lg">
                    <CardHeader>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink as={Link} to="/">خانه</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="" />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink as={Link} to="/terms">شرایط و قوانین</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <CardTitle className="text-3xl font-bold my-7 moraba">
                                شرایط و قوانین استفاده از پلتفرم کاراینجا
                            </CardTitle>
                            <img src="./src/image/AcceptTerms-bro.svg" alt="AcceptTerms" className="w-96 mx-auto" />
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-6 leading-8"
                        >
                            خوش آمدید به پلتفرم کاراینجا! استفاده از این پلتفرم به منزله پذیرش کامل شرایط و قوانین ذکر شده در این صفحه است. لطفاً پیش از استفاده از خدمات ما، این سند را به دقت مطالعه کنید. این شرایط و قوانین به منظور حفظ حقوق کاربران، کارفرمایان و پلتفرم تنظیم شده و هدف آن ایجاد محیطی امن، شفاف و قابل اعتماد برای همه طرف‌های درگیر است. در صورتی که با هر یک از بندهای این سند موافق نیستید، لطفاً از استفاده از خدمات کاراینجا خودداری کنید.
                        </motion.p>

                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-2xl font-semibold mt-8 mb-4 moraba"
                        >
                            1. تعاریف
                        </motion.h2>
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mb-6 leading-8"
                        >
                            در این سند، اصطلاحات زیر دارای معانی مشخصی هستند که به شرح زیر تعریف می‌شوند:  
                            - **کاراینجا:** پلتفرم آنلاین کاریابی که خدمات اتصال کارجویان و کارفرمایان را ارائه می‌دهد.  
                            - **کارجو:** فردی که از پلتفرم برای جستجوی فرصت‌های شغلی استفاده می‌کند.  
                            - **کارفرما:** شخص یا سازمانی که از پلتفرم برای ثبت آگهی شغلی و یافتن نیروی کار استفاده می‌کند.  
                            - **کاربر:** هر فرد یا نهادی که از خدمات کاراینجا استفاده می‌کند، اعم از کارجو یا کارفرما.  
                            - **محتوا:** هرگونه اطلاعات، متن، تصویر یا داده‌ای که توسط کاربران در پلتفرم بارگذاری می‌شود.  
                            این تعاریف به منظور شفافیت بیشتر در متن این سند به کار برده شده‌اند و در تمامی بخش‌ها قابل استناد هستند.
                        </motion.p>

                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="text-2xl font-semibold mt-8 mb-4 moraba"
                        >
                            2. شرایط استفاده
                        </motion.h2>
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mb-6 leading-8"
                        >
                            برای استفاده از خدمات کاراینجا، کاربران باید حداقل 18 سال سن داشته باشند و از نظر قانونی قادر به انعقاد قرارداد باشند. کاربران متعهد می‌شوند که اطلاعات دقیق، کامل و به‌روز را در پروفایل خود وارد کنند. هرگونه ارائه اطلاعات نادرست یا گمراه‌کننده می‌تواند منجر به تعلیق یا حذف حساب کاربری شود. همچنین، کاربران حق ندارند از پلتفرم برای اهداف غیرقانونی، فریبکارانه یا آسیب‌رسان استفاده کنند. این شامل بارگذاری محتوای غیرمجاز، توهین‌آمیز، یا نقض‌کننده حقوق دیگران می‌شود. کاراینجا این حق را برای خود محفوظ می‌دارد که در صورت مشاهده هرگونه تخلف، اقدامات لازم از جمله حذف محتوا یا مسدودسازی حساب کاربری را انجام دهد.
                        </motion.p>

                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="text-2xl font-semibold mt-8 mb-4 moraba"
                        >
                            3. حقوق و مسئولیت‌های کاربران
                        </motion.h2>
                        <motion.ul
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="list-disc pr-6 mb-6 leading-8"
                        >
                            <li>
                                <Badge variant="secondary" className="mb-2">کارجویان</Badge>
                                کارجویان موظفند رزومه‌ها و اطلاعات شخصی خود را با صداقت و دقت ارائه دهند. آن‌ها همچنین باید به شرایط شغلی اعلام‌شده توسط کارفرمایان احترام بگذارند و در فرآیند درخواست شغل، حرفه‌ای عمل کنند.
                            </li>
                            <li>
                                <Badge variant="secondary" className="mb-2">کارفرمایان</Badge>
                                کارفرمایان متعهد می‌شوند که آگهی‌های شغلی واقعی و قانونی ثبت کنند و از ارائه پیشنهادات غیرواقعی یا گمراه‌کننده خودداری کنند. آن‌ها همچنین باید به حریم خصوصی کارجویان احترام بگذارند و اطلاعات آن‌ها را تنها برای اهداف استخدامی استفاده کنند.
                            </li>
                            <li>
                                <Badge variant="secondary" className="mb-2">محتوا</Badge>
                                کاربران مسئول محتوای بارگذاری‌شده توسط خود هستند و کاراینجا هیچ‌گونه مسئولیتی در قبال صحت یا قانونی بودن این محتوا ندارد. با این حال، کاراینجا حق بررسی و حذف محتوای نامناسب را برای خود محفوظ می‌دارد.
                            </li>
                        </motion.ul>

                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className="text-2xl font-semibold mt-8 mb-4 moraba"
                        >
                            4. حریم خصوصی و امنیت
                        </motion.h2>
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 1.0 }}
                            className="mb-6 leading-8"
                        >
                            کاراینجا متعهد به حفاظت از اطلاعات شخصی کاربران است. تمامی داده‌ها با استفاده از پروتکل‌های امنیتی پیشرفته رمزنگاری می‌شوند و کاربران می‌توانند تنظیمات حریم خصوصی خود را مدیریت کنند. با این حال، کاربران نیز مسئول حفظ امنیت حساب کاربری خود هستند و باید از اشتراک‌گذاری اطلاعات ورود خود با دیگران خودداری کنند. کاراینجا هیچ‌گونه مسئولیتی در قبال خسارات ناشی از سوءاستفاده از حساب‌های کاربری به دلیل سهل‌انگاری کاربران ندارد. اطلاعات جمع‌آوری‌شده تنها برای بهبود خدمات پلتفرم و تطبیق بهتر کارجویان و کارفرمایان استفاده می‌شود و به هیچ عنوان بدون رضایت کاربر با اشخاص ثالث به اشتراک گذاشته نخواهد شد، مگر در مواردی که قانوناً الزام‌آور باشد.
                        </motion.p>

                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 1.1 }}
                            className="text-2xl font-semibold mt-8 mb-4 moraba"
                        >
                            5. محدودیت مسئولیت
                        </motion.h2>
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className="mb-6 leading-8"
                        >
                            کاراینجا تنها یک پلتفرم واسطه برای اتصال کارجویان و کارفرمایان است و هیچ‌گونه مسئولیتی در قبال قراردادهای منعقدشده بین آن‌ها، کیفیت خدمات ارائه‌شده توسط کارفرمایان، یا رفتار کاربران ندارد. ما تلاش می‌کنیم خدمات خود را با بالاترین کیفیت ارائه دهیم، اما تضمین نمی‌کنیم که پلتفرم همیشه بدون نقص یا بدون قطعی باشد. در صورت بروز هرگونه مشکل فنی، کاراینجا حق دارد خدمات را موقتاً متوقف کند تا مشکلات برطرف شوند، بدون اینکه مسئولیتی در قبال خسارات احتمالی کاربران داشته باشد.
                        </motion.p>

                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 1.3 }}
                            className="text-2xl font-semibold mt-8 mb-4 moraba"
                        >
                            6. تغییرات در شرایط و قوانین
                        </motion.h2>
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 1.4 }}
                            className="mb-6 leading-8"
                        >
                            کاراینجا این حق را برای خود محفوظ می‌دارد که در هر زمان شرایط و قوانین را تغییر دهد یا به‌روزرسانی کند. این تغییرات از طریق ایمیل یا اعلان در پلتفرم به اطلاع کاربران خواهد رسید. ادامه استفاده از خدمات پس از اعمال تغییرات به منزله پذیرش شرایط جدید است. پیشنهاد می‌کنیم به‌طور دوره‌ای این صفحه را بررسی کنید تا از آخرین تغییرات مطلع شوید.
                        </motion.p>

                        <motion.h2
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 1.5 }}
                            className="text-2xl font-semibold mt-8 mb-4 moraba"
                        >
                            7. فسخ خدمات
                        </motion.h2>
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 1.6 }}
                            className="mb-6 leading-8"
                        >
                            کاراینجا می‌تواند در هر زمان و به هر دلیلی، از جمله نقض شرایط و قوانین توسط کاربر، دسترسی او را به پلتفرم محدود یا قطع کند. کاربران نیز می‌توانند در هر زمان حساب خود را حذف کنند، اما باید توجه داشته باشند که برخی اطلاعات ممکن است به دلایل قانونی یا فنی برای مدتی در سیستم باقی بماند.
                        </motion.p>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 1.7 }}
                            className="flex justify-center gap-4 mt-8"
                        >
                            <Button as={Link} to="/" variant="outline" size="lg">
                                بازگشت به خانه
                            </Button>
                            <Button as={Link} to="/contact" variant="outline" size="lg">
                                تماس با ما
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </>
    );
};

export default Terms;
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";

const NotFound = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-5xl border-none">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-center"
                >
                    <img
                        src="/src/image/not-found.svg"
                        alt="404 Not Found"
                        className="mx-auto mb-4 w-64 h-64"
                    />
                    <h1 className="text-3xl font-bold my-7 moraba">
                        صفحه مورد نظر یافت نشد
                    </h1>
                </motion.div>
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6 leading-8 text-center"
                >
                    متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد. ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه جابجا شده باشد.
                </motion.p>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center gap-2 mt-8 md:flex-row items-center"
                >
                    <Link to="/">
                        <Button variant="outline" size="sm">
                            <FaHome className="mr-2" />
                            بازگشت به خانه
                        </Button>
                    </Link>
                    <Link to="/jobs/search">
                        <Button variant="outline" size="sm">
                            <FaSearch className="mr-2" />
                            جستجوی فرصت شغلی
                        </Button>
                    </Link>

                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
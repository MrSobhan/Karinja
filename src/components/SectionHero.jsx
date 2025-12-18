import { Wifi, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const SectionHero = () => {
  return (
    <section className="overflow-hidden py-32 container mx-auto lg:w-[80%] w-[90%]">
      <div className="container rtl">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5 text-center">
            <div
              style={{
                transform: "translate(-50%, -50%)",
              }}
              className="absolute top-1/2 left-1/2 -z-10 mx-auto size-[800px] rounded-full border p-16 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border p-16 md:p-32">
                <div className="size-full rounded-full border"></div>
              </div>
            </div>

            <span className="mx-auto flex size-16 items-center justify-center rounded-full border md:size-20">
              <Wifi className="size-6" />
            </span>

            <h2 className="mx-auto max-w-screen-lg text-3xl font-medium text-balance md:text-6xl moraba">
              دسترسی آسان به فرصت‌های شغلی
            </h2>

            <p className="mx-auto max-w-screen-md text-muted-foreground md:text-lg">
              با کاراینجا به صدها آگهی استخدامی از معتبرترین شرکت‌ها دسترسی پیدا کنید. رزومه بسازید، ارسال کنید و شغل مناسب خود را پیدا کنید.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-3 pb-12">
              <Button size="lg" asChild>
                <a href="/jobs">
                  <Zap className="mr-2 size-4" />
                  مشاهده فرصت‌ها
                </a>
              </Button>


              <div className="text-xs text-muted-foreground">مورد اعتماد بیش از ۲۵۰۰۰ شرکت در سراسر کشور</div>
            </div>
          </div>

          <img
            src="https://s34.picofile.com/file/8488683192/hro_img.jpg"
            alt="پلتفرم کاریابی کاراینجا"
            className="mx-auto w-full md:max-w-[50%] rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export { SectionHero };

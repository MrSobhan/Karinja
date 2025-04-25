import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function SectionFeature() {
  return (
    <ul
      className="container mx-auto lg:w-[80%] w-[90%] grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 rtl text-right my-32"
    >
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="رزومه‌ساز حرفه‌ای"
        description="با چند کلیک، رزومه‌ای کامل و جذاب برای استخدام در شرکت‌های برتر بساز."
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Settings className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="داشبورد مدیریت فرصت‌ها"
        description="فرصت‌های شغلی مورد علاقه‌ات رو ذخیره و پیگیری کن؛ همه‌چیز یکجا و ساده."
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="امنیت اطلاعات"
        description="اطلاعات شخصی و رزومه‌ات با بالاترین استانداردها محافظت می‌شود."
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="آزمون‌های ارزیابی شغلی"
        description="مهارت‌هات رو بسنج و برای شغل مناسب‌تر آماده شو."
      />
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="جستجوی پیشرفته فرصت‌های شغلی"
        description="براساس رشته، شهر، شرکت یا حقوق دلخواهت شغل پیدا کن."
      />
    </ul>
  );
}

const GridItem = ({ area, icon, title, description }) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 moraba text-xl font-semibold text-black md:text-2xl dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-black md:text-base dark:text-neutral-400">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

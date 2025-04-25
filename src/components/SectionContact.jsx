import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function SectionContact() {
  const [subjectInput, setSubjectInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [loadingSub, setLoadingSub] = useState(false);

  const CommentHandler = (e) => {
    e.preventDefault();
    setLoadingSub(true);
    setTimeout(() => {
      setLoadingSub(false);
      alert("نظر شما با موفقیت ثبت شد!");
    }, 1500);
  };

  const testimonials = [
    {
      quote:
        "جزئی‌نگری و امکانات نوآورانه این پلتفرم، روال کاری تیم ما رو به کلی متحول کرده. دقیقاً چیزی بود که دنبالش می‌گشتیم.",
      name: "سارا چن",
      designation: "مدیر محصول در TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "فرایند پیاده‌سازی خیلی روان و بی‌دردسر بود، و نتایجش فراتر از انتظارمون. انعطاف‌پذیری این پلتفرم واقعاً فوق‌العاده‌ست.",
      name: "مایکل رودریگز",
      designation: "مدیر ارشد فناوری در InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "این راهکار بهره‌وری تیممون رو به‌طرز چشمگیری بالا برد. رابط کاربری ساده و شهودی باعث میشه حتی کارهای پیچیده راحت پیش برن.",
      name: "امیلی واتسون",
      designation: "مدیر عملیات در CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "پشتیبانی عالی و امکانات قوی. به‌ندرت محصولی پیدا میشه که واقعاً به تمام قول‌هاش عمل کنه، اما این یکی دقیقاً همینه.",
      name: "جیمز کیم",
      designation: "سرپرست مهندسی در DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "قابلیت مقیاس‌پذیری و عملکرد بی‌نقص این سرویس، نقطه عطفی برای سازمان ما بود. واقعاً پیشنهادش می‌کنم به هر کسب‌و‌کاری که در حال رشده.",
      name: "لیزا تامپسون",
      designation: "معاون فناوری در FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];


  return (
    <section className="py-8 pb-14 lg:pb-24 container relative mx-auto lg:w-[80%] w-[90%] rtl text-right">
      <div
        style={{
          transform: "translate(-50%, -50%)",
        }}
        className="absolute top-1/2 left-1/2 -z-10 mx-auto size-[200px] rounded-full border p-16 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[800px] md:p-32"
      >
        <div className="size-full rounded-full border p-16 md:p-32">
          <div className="size-full rounded-full border"></div>
        </div>
      </div>
      <h3 className="titleSlider moraba mr-3 mb-16">ارتباط با ما</h3>
      <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-2 items-start">
        <img
          src="https://i.redd.it/0uermbt9q8b61.jpg"
          alt="map"
          className="block lg:hidden w-full h-full max-w-[500px] max-h-[500px] rounded-xl object-contain mx-auto"
        />
        <form onSubmit={CommentHandler} className="flex flex-col gap-4 max-w-[500px] mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full-name" className="mb-2 block text-sm font-medium">
                نام و نام خانوادگی
              </Label>
              <Input id="full-name" type="text" placeholder="مثلاً علی رضایی" />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block text-sm font-medium">
                ایمیل
              </Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">موضوع</Label>
            <Select value={subjectInput} onValueChange={setSubjectInput}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب موضوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="گزارش مشکل">گزارش مشکل</SelectItem>
                <SelectItem value="درخواست ویژگی جدید">درخواست ویژگی جدید</SelectItem>
                <SelectItem value="سوال">سوال</SelectItem>
                <SelectItem value="بازخورد">بازخورد</SelectItem>
                <SelectItem value="پیشنهاد">پیشنهاد</SelectItem>
                <SelectItem value="انتقاد">انتقاد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">متن نظر</Label>
            <Textarea
              rows={6}
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="نظر خود را وارد کنید..."
            />
          </div>
          <Button type="submit" className="w-full">
            {loadingSub && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ارسال نظرات
          </Button>
        </form>
        <img
          src="./src/image/contact_img.jpg"
          alt="map"
          className="hidden lg:block w-full h-full lg:max-h-[510px] rounded-lg img__contact"
        />
      </div>
      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  );
}

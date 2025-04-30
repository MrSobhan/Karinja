import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div
      className="*:data-[slot=card]:shadow-xs grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid lg:grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="text-right">کل درآمد</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-right">
           1,250.00  <sub className="text-sm">تومان</sub>
          </CardTitle>
          <div className="absolute left-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              +12.5%
              <TrendingUpIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-right flex dir-rtl">
          <div className="line-clamp-1 flex gap-2 font-medium flex-row-reverse">
            <TrendingUpIcon className="size-4" />
            روند صعودی در این ماه
          </div>
          <div className="text-muted-foreground">
            بازدیدکنندگان در ۶ ماه گذشته
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="text-right">مشتریان جدید</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-right">
            1,234
          </CardTitle>
          <div className="absolute left-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              -20%
              <TrendingDownIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-right flex dir-rtl">
          <div className="line-clamp-1 flex gap-2 font-medium flex-row-reverse">
            <TrendingDownIcon className="size-4" />
            کاهش ۲۰٪ در این دوره
          </div>
          <div className="text-muted-foreground">
            جذب مشتری نیاز به توجه دارد
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="text-right">حساب‌های فعال</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-right">
            45,678
          </CardTitle>
          <div className="absolute left-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              +12.5%
              <TrendingUpIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-right flex dir-rtl">
          <div className="line-clamp-1 flex gap-2 font-medium flex-row-reverse">
            <TrendingUpIcon className="size-4" />
            حفظ کاربر قوی
          </div>
          <div className="text-muted-foreground">تعامل فراتر از اهداف</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="text-right">نرخ رشد</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-right">
            4.5%
          </CardTitle>
          <div className="absolute left-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              +4.5%
              <TrendingUpIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-right flex dir-rtl">
          <div className="line-clamp-1 flex gap-2 font-medium flex-row-reverse">
            <TrendingUpIcon className="size-4" />
            عملکرد پایدار
          </div>
          <div className="text-muted-foreground">مطابق با پیش‌بینی‌های رشد</div>
        </CardFooter>
      </Card>
    </div>
  );
}
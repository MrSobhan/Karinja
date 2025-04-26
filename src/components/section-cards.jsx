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
      className="*:data-[slot=card]:shadow-xs grid-cols-1  @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid lg:grid-cols-4  gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="text-right">Total Revenue</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-right">
            $1,250.00
          </CardTitle>
          <div className="absolute left-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              +12.5%
              <TrendingUpIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-end gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <TrendingUpIcon className="size-4" />
            Trending up this month
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="text-right">New Customers</CardDescription>
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
        <CardFooter className="flex-col items-end gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <TrendingDownIcon className="size-4" />
            Down 20% this period
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="text-right">Active Accounts</CardDescription>
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
        <CardFooter className="flex-col items-end gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <TrendingUpIcon className="size-4" />
            Strong user retention
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription className="text-right">Growth Rate</CardDescription>
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
        <CardFooter className="flex-col items-end gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <TrendingUpIcon className="size-4" />
            Steady performance
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
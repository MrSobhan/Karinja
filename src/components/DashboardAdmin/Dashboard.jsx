import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import SectionBarChart from "@/components/BarChart"
import SectionPieChart from "@/components/PieChart"

export default function Dashboard() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex md:flex-row flex-col items-center justify-evenly lg:px-6 gap-5">
          <SectionPieChart />
          <SectionBarChart />
        </div>
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </div>
    </div>
  )
}

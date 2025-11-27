import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import SectionBarChart from "@/components/BarChart"
import SectionPieChart from "@/components/PieChart"
import { useEffect, useState } from "react"
import useAxios from "@/hooks/useAxios"
import { LuLoaderCircle } from "react-icons/lu"
import TotalStatsCards from "./TotalStatsCards"
import BarChartCard from "./BarChartCard"
import PieChartCard from "./PieChartCard"
import SummaryCard from "./SummaryCard"
import SingleValueCard from "./SingleValueCard"

const FA_TABLE_TITLES = {
  applications_by_status: {
    title: "درخواست‌ها بر اساس وضعیت",
    description: "توزیع درخواست‌های شغلی بر اساس وضعیت",
    name: "وضعیت",
    value: "تعداد"
  },
  top_skills: {
    title: "برترین مهارت‌ها",
    description: "محبوب‌ترین مهارت‌های درخواست شده",
    name: "مهارت",
    value: "تعداد"
  },
  resumes_by_visibility: {
    title: "رزومه‌ها بر اساس وضعیت نمایش",
    description: "توزیع رزومه‌ها بر اساس وضعیت نمایش",
    name: "وضعیت",
    value: "تعداد"
  },
  applicants_by_province: {
    title: "متقاضیان بر اساس استان",
    description: "توزیع جغرافیایی متقاضیان",
    name: "استان",
    value: "تعداد"
  },
  education_degree_distribution: {
    title: "توزیع مدرک تحصیلی",
    description: "توزیع متقاضیان بر اساس مدرک تحصیلی",
    name: "مدرک",
    value: "تعداد"
  }
}

export default function Dashboard() {
  const axiosInstance = useAxios()
  const [advancedData, setAdvancedData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvancedData = async () => {
      try {
        const response = await axiosInstance.get("/advanced")
        setAdvancedData(response.data)
      } catch (error) {
        console.error("Error fetching advanced data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdvancedData()
  }, [axiosInstance])

  if (loading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-center py-20">
          <LuLoaderCircle className="animate-spin h-8 w-8 text-black dark:text-white" />
        </div>
      </div>
    )
  }

  // Parse data for charts and tables
  const applicationsByStatusData = advancedData?.applications_by_status?.map(item => ({
    name: item.key,
    value: item.count
  })) || []

  const topSkillsData = advancedData?.top_skills?.map(item => ({
    name: item.key,
    value: item.count
  })) || []

  const resumesByVisibilityData = advancedData?.resumes_by_visibility?.map(item => ({
    name: item.key,
    value: item.count
  })) || []

  const applicantsByProvinceData = advancedData?.applicants_by_province?.map(item => ({
    name: item.key,
    value: item.count
  })) || []

  const educationDegreeData = advancedData?.education_degree_distribution?.map(item => ({
    name: item.key,
    value: item.count
  })) || []

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <TotalStatsCards totals={advancedData?.totals} />

        <div className="flex md:flex-row flex-col items-center justify-evenly lg:px-6 gap-5">
          <SectionPieChart />
          <SectionBarChart />
        </div>
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>

        <div className="px-4 lg:px-6 space-y-6">
          {/* <h2 className="text-2xl font-bold moraba">آمار پیشرفته</h2> */}
          
          {/* Applications by Status */}
          {applicationsByStatusData.length > 0 && (
            <BarChartCard
              title={FA_TABLE_TITLES.applications_by_status.title}
              description={FA_TABLE_TITLES.applications_by_status.description}
              data={applicationsByStatusData}
              config={{
                value: {
                  label: "تعداد",
                  color: "hsl(var(--chart-1))",
                },
              }}
              columns={[
                { key: "name", header: FA_TABLE_TITLES.applications_by_status.name },
                { key: "value", header: FA_TABLE_TITLES.applications_by_status.value }
              ]}
            />
          )}

          {/* Top Skills */}
          {topSkillsData.length > 0 && (
            <BarChartCard
              title={FA_TABLE_TITLES.top_skills.title}
              description={FA_TABLE_TITLES.top_skills.description}
              data={topSkillsData}
              config={{
                value: {
                  label: "تعداد",
                  color: "hsl(var(--chart-2))",
                },
              }}
              columns={[
                { key: "name", header: FA_TABLE_TITLES.top_skills.name },
                { key: "value", header: FA_TABLE_TITLES.top_skills.value }
              ]}
            />
          )}

          {/* Summary for Applications per Posting */}
          {Boolean(
            advancedData?.applications_per_posting?.min ||
            advancedData?.applications_per_posting?.max ||
            advancedData?.applications_per_posting?.avg
          ) && (
            <SummaryCard
              title="درخواست‌ها به ازای هر فرصت شغلی"
              description="حداقل، حداکثر و میانگین درخواست‌ها برای هر آگهی"
              items={[
                { label: "حداقل", value: advancedData?.applications_per_posting?.min ?? 0 },
                { label: "حداکثر", value: advancedData?.applications_per_posting?.max ?? 0 },
                { label: "میانگین", value: advancedData?.applications_per_posting?.avg ?? 0 },
              ]}
            />
          )}

          {/* Average Time to First Application */}
          {advancedData?.average_time_to_first_application_days !== null && 
           advancedData?.average_time_to_first_application_days !== undefined && (
            <SingleValueCard
              title="میانگین زمان تا اولین درخواست"
              description="از زمان انتشار فرصت شغلی تا اولین درخواست (به روز)"
              value={advancedData?.average_time_to_first_application_days}
              unit="روز"
            />
          )}

          {/* Resumes by Visibility */}
          {resumesByVisibilityData.length > 0 && (
            <PieChartCard
              title={FA_TABLE_TITLES.resumes_by_visibility.title}
              description={FA_TABLE_TITLES.resumes_by_visibility.description}
              data={resumesByVisibilityData}
              columns={[
                { key: "name", header: FA_TABLE_TITLES.resumes_by_visibility.name },
                { key: "value", header: FA_TABLE_TITLES.resumes_by_visibility.value }
              ]}
            />
          )}

          {/* Applicants by Province */}
          {applicantsByProvinceData.length > 0 && (
            <BarChartCard
              title={FA_TABLE_TITLES.applicants_by_province.title}
              description={FA_TABLE_TITLES.applicants_by_province.description}
              data={applicantsByProvinceData}
              config={{
                value: {
                  label: "تعداد",
                  color: "hsl(var(--chart-3))",
                },
              }}
              columns={[
                { key: "name", header: FA_TABLE_TITLES.applicants_by_province.name },
                { key: "value", header: FA_TABLE_TITLES.applicants_by_province.value }
              ]}
            />
          )}

          {/* Education Degree Distribution */}
          {educationDegreeData.length > 0 && (
            <PieChartCard
              title={FA_TABLE_TITLES.education_degree_distribution.title}
              description={FA_TABLE_TITLES.education_degree_distribution.description}
              data={educationDegreeData}
              columns={[
                { key: "name", header: FA_TABLE_TITLES.education_degree_distribution.name },
                { key: "value", header: FA_TABLE_TITLES.education_degree_distribution.value }
              ]}
            />
          )}
          
        </div>
      </div>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SummaryCard({ title, description, items }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {items.map((item, index) => (
            <div key={index}>
              <div className="font-bold">{item.label}</div>
              <div>{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


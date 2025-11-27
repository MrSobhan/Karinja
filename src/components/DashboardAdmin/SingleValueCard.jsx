import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SingleValueCard({ title, description, value, unit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          {typeof value === "number" ? value : "-"}
        </p>
        {unit && <p className="text-muted-foreground text-sm">{unit}</p>}
      </CardContent>
    </Card>
  )
}


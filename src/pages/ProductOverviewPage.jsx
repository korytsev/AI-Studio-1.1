import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ProductOverviewPage() {
  return (
    <div className="p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Metric one</CardTitle>
            <p className="text-2xl font-bold text-foreground">—</p>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Metric two</CardTitle>
            <p className="text-2xl font-bold text-foreground">—</p>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Metric three</CardTitle>
            <p className="text-2xl font-bold text-foreground">—</p>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Metric four</CardTitle>
            <p className="text-2xl font-bold text-foreground">—</p>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Activity / Chart placeholder</CardTitle>
          <CardDescription>Analytics content will be defined later</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-[0.25rem] bg-muted/50 text-muted-foreground text-sm">
            Chart or table placeholder
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

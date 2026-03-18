import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PlaceholderTabPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Content coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page is a shell for future content. Routing and navigation are in place.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

import { DeleteEventTypeAction } from '@/app/actions'
import { SubmitButton } from '@/app/components/SubmitButtons'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function DeleteEventType({
  params,
}: {
  params: { eventTypeId: string }
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-[350px] w-full">
        <CardHeader className="flex justify-center items-center">
          <CardTitle>Delete Event Type</CardTitle>
          <CardDescription>
            Are you sure you want to delete this Event ?
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex items-center justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <form action={DeleteEventTypeAction}>
            <input type="hidden" name="id" value={params.eventTypeId} />
            <SubmitButton text='Delete Event' variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

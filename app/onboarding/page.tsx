"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from 'react-dom'
import { OnboardingAction } from '../actions'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { onboardingSchema } from '../lib/zodSchemas'
import { SubmitButton } from '../components/SubmitButtons'

export default function OnboardingRoute() {
  const [lastResult, action] = useFormState(OnboardingAction, undefined)

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      })
    },

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })
  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome to Calend<span className="text-primary">Andy</span>
          </CardTitle>
          <CardDescription>
            We need the following Information to set up your Profile!
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="flex flex-col gap-y-5">
            <div className="grid gap-y-2">
              <Label>Full Name</Label>
              <Input
                name={fields.fullName.name}
                defaultValue={fields.fullName.initialValue}
                key={fields.fullName.key}
                placeholder="Andy"
              />
              <p className='text-red-500 text-sm'>{fields.fullName.errors}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  AndysTeam.com/
                </span>
                <Input
                  className="rounded-l-none "
                  placeholder="example-user-1"
                  name={fields.username.name}
                  key={fields.username.key}
                  defaultValue={fields.username.initialValue}
                />
              </div>
                <p className='text-red-500 text-sm'>{fields.username.errors}</p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton className='w-full' text='Submit' />
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

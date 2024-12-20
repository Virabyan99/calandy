'use server'

import prisma from './lib/db'
import { parseWithZod } from '@conform-to/zod'
import { onboardingSchemaValidation, settingsSchema } from './lib/zodSchemas'
import { redirect } from 'next/navigation'
import { auth } from './lib/auth'

export async function OnboardingAction(prevState: any, formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return redirect('/')
  }

  const submission = await parseWithZod(formData, {
    schema: onboardingSchemaValidation({
      async isUsernameUnique() {
        const username = formData.get('username') as string // Changed to match schema key

        // Validate username is not null or empty
        if (!username || username.trim() === '') {
          throw new Error('Username cannot be empty.')
        }

        const existingUsername = await prisma.user.findUnique({
          where: {
            userName: username.trim(), // Ensure no whitespace
          },
        })
        return !existingUsername
      },
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  await prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      userName: submission.value.username.trim(), // Ensure consistency with schema
      name: submission.value.fullName,
    },
  })

  return redirect('/onboarding/grant-id')
}

export async function SettingsAction(prevState: any, formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return redirect('/')
  }

  const submission = parseWithZod(formData, {
    schema: settingsSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  })

  return redirect('/dashboard')
}

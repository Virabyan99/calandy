'use server'

import prisma from './lib/db'
import { parseWithZod } from '@conform-to/zod'
import { eventTypeSchema, onboardingSchemaValidation, settingsSchema } from './lib/zodSchemas'
import { redirect } from 'next/navigation'
import { auth } from './lib/auth'
import { revalidatePath } from 'next/cache'

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

  const data = await prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      userName: submission.value.username, // Add .trim() if error acurres  WARNING
      name: submission.value.fullName,
      availability: {
        createMany: {
          data: [
            {
              day: 'Monday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Tuesday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Wednesday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Thursday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Friday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Saturday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Sunday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
          ],
        },
      },
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

export async function updateAvailabilityAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return redirect('/')
  }

  const rawData = Object.fromEntries(formData.entries())

  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith('id-'))
    .map((key) => {
      const id = key.replace('id-', '')

      return {
        id,
        isActive: rawData[`isActive-${id}`] === 'on',
        fromTime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      }
    })

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: {
            id: item.id,
          },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );

    revalidatePath("/dashboard/availability")
  } catch (error) {
    console.log(error)
  }
}


export async function CreateEventTypeAction(prevState: any , formData: FormData) {
  const session = await auth()
  if (!session) {
    return redirect('/')
  }

  const submission = parseWithZod(formData, {
    schema: eventTypeSchema,
  })

  if(submission.status !== "success") {
    return submission.reply()
  }

  await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      description: submission.value.description,
      url: submission.value.url,
      videoCallSoftware: submission.value.videoCallSoftware,
      userId: session.user?.id
    }
  })

  return redirect('/dashboard')
}

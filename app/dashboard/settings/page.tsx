import SettingsForm from '@/app/components/SettingsForm'
import { auth } from '@/app/lib/auth'
import prisma from '@/app/lib/db'
import { notFound, redirect } from 'next/navigation'

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
      image: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

export default async function Settingsroute() {
  const session = await auth()
  if (!session) {
    return redirect('/')
  }

  const data = await getData(session.user?.id as string)
  return (
    <SettingsForm
      email={data.email}
      fullName={data.name as string}
      profileImage={data.image as string}
    />
  )
}

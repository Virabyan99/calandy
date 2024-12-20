import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { nylas, nylasConfig } from "@/app/lib/nylas";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const session = await auth()
    if(!session) {
        return redirect('/')
    }

    const url = new URL(req.url)
    const code = url.searchParams.get('code')

    if(!code) {
        return Response.json('hey we did not get a code', {
            status: 400
        })
    }

    try {
        const response = await nylas.auth.exchangeCodeForToken({
            clientSecret: nylasConfig.apiKey,
            clientId: nylasConfig.clientId,
            redirectUri: nylasConfig.redirectUri,
            code: code
        })

        const {grantId, email} = response

        await prisma.user.update({
            where: {
                id: session.user?.id
            },
            data: {
                grantId: grantId,
                grantEmail: email
            }
        })
    } catch (error) {
        throw new Error(`Error something went wrong ${error}`)
    }
    redirect('/dashboard')
}
'use client'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NextPage } from 'next'
import route from '@/route'

interface Props { }

const SignIn: NextPage<Props> = ({ }) => {
    return <Card className='w-full max-w-sm'>
        <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
            <form>
                <div className="flex flex-col gap-6">
                    <Button type='button' onClick={() => signIn('google', {
                        redirectTo: route('dashboard')
                    })} variant="outline" className="w-full hover:cursor-pointer">
                        Login with Google
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
}

export default SignIn
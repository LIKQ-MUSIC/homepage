'use client'

import React, { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/actions/auth'
import Image from 'next/image'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Input } from '@/ui/Input'
import Button from '@/ui/Button'
import { Label } from '@/ui/Label'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)
        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            const result = await updatePassword(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                setIsSuccess(true)
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            }
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#153051] to-[#0f2340] px-4 py-12">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <Image
                        src="/logo-default.svg"
                        alt="LIKQ"
                        width={120}
                        height={40}
                        className="mx-auto"
                        priority
                    />
                    <h2 className="mt-8 text-2xl font-bold tracking-tight text-white">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Choose a strong password for your account.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {isSuccess ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle2 className="h-16 w-16 text-emerald-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-white">Password Updated!</h3>
                                <p className="text-sm text-white/60">
                                    Redirecting to your dashboard...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-200 border border-red-500/20 text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-white/80">New Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white/80">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/20 focus:ring-white/20"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white border-0"
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    'Update Password'
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

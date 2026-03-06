'use client'

import React, { useTransition, useState } from 'react'
import { forgotPassword } from '@/actions/auth'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Input } from '@/ui/Input'
import Button from '@/ui/Button'
import { Label } from '@/ui/Label'

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)
        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            const result = await forgotPassword(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                setIsSuccess(true)
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
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        {isSuccess
                            ? "We've sent a recovery link to your email."
                            : "Enter your email to receive a password recovery link."}
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {isSuccess ? (
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <CheckCircle2 className="h-16 w-16 text-emerald-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-white">Check your email</h3>
                                <p className="text-sm text-white/60">
                                    Please click the link in the email we sent you to reset your password.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back to login
                            </Link>
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
                                    <Label className="text-white/80">Email address</Label>
                                    <Input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        placeholder="Enter your email"
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
                                    'Send Reset Link'
                                )}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={14} />
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

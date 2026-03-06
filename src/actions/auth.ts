'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { apiClient } from '@/lib/api-client'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Type-casting here for convenience
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string
  }

  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  })

  if (error) {
    return { error: error.message }
  }

  if (authData.user && authData.session) {
    // Create user in our DB
    try {
      await apiClient.post(
        '/users',
        {
          email: data.email,
          name: data.name
        },
        {
          headers: {
            Authorization: `Bearer ${authData.session.access_token}`
          }
        }
      )
    } catch (dbError) {
      console.error('Failed to create user in DB:', dbError)
      // We might want to rollback auth here, but that's complex without admin api.
      // For now, return error.
      return { error: 'Failed to create application user record.' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string

  try {
    const response = await apiClient.post('/auth/forgot-password', {
      email
    })

    if (!response.data.success) {
      return { error: response.data.message || 'Failed to send reset link.' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Forgot password failed:', error)
    return {
      error:
        error.response?.data?.message ||
        'An error occurred. Please try again later.'
    }
  }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      return { error: error.message }
    }

    // Optionally notify gateway
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      if (session) {
        await apiClient.post(
          '/auth/update-password',
          {},
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        )
      }
    } catch (e) {
      console.warn('Failed to notify gateway of password update', e)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Update password failed:', error)
    return { error: 'An error occurred. Please try again later.' }
  }
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    // redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

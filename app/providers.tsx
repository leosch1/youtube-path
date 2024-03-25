'use client'
import React, { ReactNode } from 'react';
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const NEXT_PUBLIC_POSTHOG_KEY = "phc_EU80hbVZJHdKO2qHLaCG9P4gddpEE2Y0BbAn10hWi1Z"
const NEXT_PUBLIC_POSTHOG_HOST = "https://eu.posthog.com"

if (typeof window !== 'undefined') {
  posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: NEXT_PUBLIC_POSTHOG_HOST,
  })
}

interface CSPostHogProviderProps {
  children: ReactNode;
}

export function CSPostHogProvider({ children }: CSPostHogProviderProps) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

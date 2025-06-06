'use client'
import { NextPage } from 'next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient();

interface Props { children: ReactNode }

const Providers: NextPage<Props> = ({ children }) => {
  return <>
    <SessionProvider >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  </>
}

export default Providers
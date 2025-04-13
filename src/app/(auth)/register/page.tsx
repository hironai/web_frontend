"use client";

import RegisterComponent from '@/components/auth/register';
import { Suspense } from 'react';


export default function Register() {

    return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterComponent />
    </Suspense>
    );
}
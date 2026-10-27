'use client'

import type { ReactNode } from 'react'
import { useActionState } from 'react'
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Field, Input } from 'plume-ui-react'
import { signIn, type SignInState } from '@/app/actions'
import styles from './login.module.css'

const initialState: SignInState = {}

export function LoginForm(): ReactNode {
  const [state, action, pending] = useActionState(signIn, initialState)
  return (
    <Card className={styles.card} variant="outline">
      <form action={action} noValidate>
        <CardHeader>Sign in to Plume Projects</CardHeader>
        <CardBody>
          <div className={styles.fields}>
            <Alert status="info">
              This is a simulated sign in: any email and a password of 6 or more characters work.
            </Alert>
            <Field errorText={state.errors?.email} label="Email" required>
              <Input
                autoComplete="email"
                defaultValue={state.email}
                name="email"
                placeholder="ana@plume.dev"
                type="email"
              />
            </Field>
            <Field errorText={state.errors?.password} label="Password" required>
              <Input autoComplete="current-password" name="password" revealable type="password" />
            </Field>
          </div>
        </CardBody>
        <CardFooter>
          <Button busy={pending} busyText="Signing in…" type="submit">
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

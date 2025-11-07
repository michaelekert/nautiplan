import { useMutation } from '@tanstack/react-query'
import { login, register, logout } from '../api/auth'
import { useAuthContext } from '../context/AuthContext'

type UseLoginOptions = { onSuccess?: () => void }

export function useLogin(options?: UseLoginOptions) {
  const { setUser } = useAuthContext()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (user) => {
      setUser(user)
      options?.onSuccess?.()
    },
  })
}

export function useRegister(options?: UseLoginOptions) {
  const { setUser } = useAuthContext()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password).then(() => ({ email })), // minimalny user
    onSuccess: (user) => {
      setUser(user)
      options?.onSuccess?.()
    },
  })
}

export function useLogout() {
  const { signOut } = useAuthContext()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => signOut(),
  })
}

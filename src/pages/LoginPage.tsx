import { useLogin } from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const navigate = useNavigate()
  const login = useLogin()

  const onSubmit = (data: LoginForm) =>
    login.mutate(data, {
      onSuccess: () => navigate('/'),
      onError: (err) => console.error(err),
    })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-bold">Logowanie</h1>
      <input {...register('email')} placeholder="Email" className="border p-2 rounded" />
      <input
        {...register('password')}
        placeholder="Hasło"
        type="password"
        className="border p-2 rounded"
      />
      <button type="submit" disabled={login.isLoading} className="bg-blue-600 text-white p-2 rounded">
        {login.isLoading ? 'Logowanie...' : 'Zaloguj się'}
      </button>
      {login.error && <p className="text-red-500">{(login.error as Error).message}</p>}
    </form>
  )
}

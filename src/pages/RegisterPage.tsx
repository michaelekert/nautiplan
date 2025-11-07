import { useRegister } from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const navigate = useNavigate()
  const registerMutation = useRegister()

  const onSubmit = (data: RegisterForm) =>
    registerMutation.mutate(data, {
      onSuccess: () => navigate('/login'),
      onError: (err) => console.error(err),
    })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-bold">Rejestracja</h1>
      <input {...register('email')} placeholder="Email" className="border p-2 rounded" />
      <input
        {...register('password')}
        placeholder="Hasło"
        type="password"
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={registerMutation.isLoading}
        className="bg-green-600 text-white p-2 rounded"
      >
        {registerMutation.isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
      </button>
      {registerMutation.error && <p className="text-red-500">{(registerMutation.error as Error).message}</p>}
    </form>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const setAuth  = useAuthStore(s => s.setAuth)
  const signout  = useAuthStore(s => s.signout)
  const navigate = useNavigate()

  const signup = async (data) => {
    setLoading(true)
    try {
      const res = await authApi.signup(data)
      setAuth(res)
      toast.success(`Welcome, ${res.full_name}!`)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Signup failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const signin = async (data) => {
    setLoading(true)
    try {
      const res = await authApi.signin(data)
      setAuth(res)
      toast.success('Signed in successfully')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    signout()
    navigate('/signin')
    toast.success('Signed out')
  }

  return { signup, signin, logout, loading }
}

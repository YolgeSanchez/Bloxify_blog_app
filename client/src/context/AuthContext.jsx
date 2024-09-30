import { createContext, useState, useContext, useEffect } from 'react'
import {
  registerCall,
  loginCall,
  profileCall,
  verifyToken,
  logoutCall,
  avatarCall,
} from '../api/auth.js'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be use within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const registerUser = async (user) => {
    try {
      const response = await registerCall(user)
      const data = response.data
      setUser(data)
      setIsAuthenticated(true)
      navigate('/')
    } catch (error) {
      setErrors(error.response.data)
    }
  }

  const loginUser = async (user) => {
    try {
      const response = await loginCall(user)
      const data = response.data
      setUser(data)
      setIsAuthenticated(true)
    } catch (error) {
      setErrors(error.response.data)
    }
  }

  const uploadAvatar = async (avatar) => {
    try {
      await avatarCall(avatar)
      navigate('/')
    } catch (err) {
      console.log(err)
      setErrors(err.response.data)
    }
  }

  const getProfile = async (user) => {
    try {
      const response = await profileCall(user)
      const data = response.data
      return data
    } catch (error) {
      console.log(error.response.data)
      setErrors(error.response.data)
    }
  }

  const logout = async () => {
    try {
      await logoutCall()
      Cookies.remove('token')
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.log(error.response.data)
      setErrors(error.response.data)
    }
  }

  useEffect(() => {
    if (errors.length > 0) {
      setTimeout(() => {
        setErrors([])
      }, 5000)
    }
  }, [errors])

  useEffect(() => {
    async function checkToken() {
      const cookies = Cookies.get()
      const token = cookies.token

      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const response = await verifyToken()
        if (!response.data) {
          setLoading(false)
          setIsAuthenticated(false)
          return
        }

        const data = response.data
        setUser(data)
        setIsAuthenticated(true)
        setLoading(false)
      } catch (error) {
        setErrors(error.response.data)
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)(false)
      }
    }
    checkToken()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        registerUser,
        loginUser,
        getProfile,
        uploadAvatar,
        logout,
        user,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

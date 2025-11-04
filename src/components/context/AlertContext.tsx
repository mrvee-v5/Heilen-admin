'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import AlertWrapper from '../ui/alert/AlertWrapper'

// Define the shape of the alert data
interface AlertData {
  show: boolean
  variant: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

// Define the shape of the context values
interface AlertContextType {
  alert: AlertData
  showAlert: (
    variant: AlertData['variant'],
    title: string,
    message: string
  ) => void
  hideAlert: () => void
}

// Create the context with default values
const AlertContext = createContext<AlertContextType | undefined>(undefined)

// Define the provider component
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertData>({
    show: false,
    variant: 'info',
    title: '',
    message: '',
  })

  const showAlert = (
    variant: AlertData['variant'],
    title: string,
    message: string
  ) => {
    setAlert({
      show: true,
      variant,
      title,
      message,
    })
    // Optionally, hide the alert automatically after a few seconds
    setTimeout(() => {
      hideAlert()
    }, 5000)
  }

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }))
  }

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
      <AlertWrapper />
    </AlertContext.Provider>
  )
}

// Create a custom hook for easy access to the context
export const useAlert = () => {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

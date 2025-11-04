'use client'
import React, { useEffect, useState } from 'react'
import { useModal } from '../../hooks/useModal'
import { Modal } from '../ui/modal'
import Button from '../ui/button/Button'
import Input from '../form/input/InputField'
import Label from '../form/Label'
import Image from 'next/image'
import { UserDetail } from '@/services/types'
import { extractStringPoint, getLocationDetails } from '@/utils'
import { updateUserSubscription } from '@/services/users.service'
import { useAlert } from '../context/AlertContext'

interface UserMetaCardProps {
  user: UserDetail
}

const availablePackages = ['platinum', 'silver', 'bronze', 'gold', 'free']

const UserMetaCard: React.FC<UserMetaCardProps> = ({ user }) => {
  const { isOpen, openModal, closeModal } = useModal()
  const { showAlert } = useAlert()

  const [resolvedAddress, setResolvedAddress] = useState<string>('Loading...')

  const [isSaving, setIsSaving] = useState(false)
  const [assignedPackage, setAssignedPackage] = useState(
    user.subscriptionType || 'free'
  )
  const [isActive, setIsActive] = useState(!!user.subscribed)

  const [tempPackage, setTempPackage] = useState(assignedPackage)
  const [tempIsActive, setTempIsActive] = useState(isActive)

  // Fetch address from coordinates
  useEffect(() => {
    const fetchAddress = async () => {
      if (user?.location) {
        const coords = extractStringPoint(user.location)
        if (coords && coords.length === 2) {
          const [lng, lat] = coords.map(parseFloat)
          try {
            const data = await getLocationDetails(lat, lng)
            const formattedAddress =
              data?.results?.[0]?.formatted_address || 'Location not found'
            setResolvedAddress(formattedAddress)
          } catch {
            setResolvedAddress('Error fetching location')
          }
        } else {
          setResolvedAddress('Invalid coordinates')
        }
      } else {
        setResolvedAddress('N/A')
      }
    }
    fetchAddress()
  }, [user?.location])

  // Sync user data when it updates
  useEffect(() => {
    if (user) {
      setAssignedPackage(user.subscriptionType || 'free')
      setIsActive(!!user.subscribed)
    }
  }, [user])

  // Open modal and load temporary states
  const handleOpenModal = () => {
    setTempPackage(assignedPackage)
    setTempIsActive(isActive)
    openModal()
  }

  // Save subscription updates
  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateUserSubscription(
        user.id,
        tempIsActive,
        tempPackage.toLowerCase()
      )
      setAssignedPackage(tempPackage)
      setIsActive(tempIsActive)
      closeModal()
      showAlert(
        'success',
        'Package Updated',
        'Subscription package updated successfully.'
      )
    } catch {
      showAlert(
        'error',
        'Update Failed',
        'Failed to update subscription. Please try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full flex-col items-center gap-6 xl:flex-row">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={user.profileImg || '/images/user/owner.jpg'}
                alt={user.name}
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90">
                {user.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.business?.businessName || 'N/A'}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 xl:block dark:bg-gray-700"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {resolvedAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Assign Package Button */}
        </div>

        {/* Personal Info Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:p-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  First Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.firstName}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Last Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.lastName}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.phoneNumber || 'N/A'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Subscription
                </p>
                <p className="text-sm font-medium text-gray-800 capitalize dark:text-white/90">
                  {assignedPackage} ({isActive ? 'Active' : 'Inactive'})
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end xl:w-auto">
          <button
            onClick={handleOpenModal}
            className="shadow-theme-xs hover:bg-opacity-90 flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-[#7B8A76] px-4 py-3 text-sm font-medium text-white"
          >
            Assign Package
          </button>
        </div>
      </div>

      {/* Subscription Modal */}
      <Modal
        showCloseButton={false}
        isOpen={isOpen}
        onClose={closeModal}
        className="m-4 max-w-[400px]"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-900">
            <div className="flex items-center justify-between bg-[#54392A] px-5 py-3">
              <h4 className="text-xl font-semibold text-white">
                Assign Subscription Package
              </h4>
              <button
                onClick={closeModal}
                className="text-xl text-white hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <Label htmlFor="package-select">Package</Label>
                <select
                  id="package-select"
                  value={tempPackage}
                  onChange={(e) => setTempPackage(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 dark:bg-gray-800 dark:text-white"
                >
                  {availablePackages.map((pkg) => (
                    <option key={pkg} value={pkg}>
                      {pkg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <Label htmlFor="subscription-toggle" className="mb-0">
                  Subscription Active
                </Label>
                <button
                  id="subscription-toggle"
                  role="switch"
                  aria-checked={tempIsActive}
                  onClick={() => setTempIsActive((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tempIsActive
                      ? 'bg-[#C06A4D]'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      tempIsActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default UserMetaCard

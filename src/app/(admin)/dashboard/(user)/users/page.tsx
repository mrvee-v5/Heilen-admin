'use client'
import React, { useState, useEffect } from 'react'

import Image from 'next/image'
import { CloseLineIcon, CopyIcon, SearchIcon } from '@/icons'
import * as XLSX from 'xlsx'
import { Circles } from 'react-loader-spinner'
import {
  getUsers,
  registerUser,
  updateUserPassword,
  deleteUser,
} from '@/services/users.service'
import ComponentCard from '@/components/common/ComponentCard'
import Pagination from '@/components/tables/Pagination'
import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table'
import FileUploader from '@/components/common/FileUploader'
import { useAlert } from '@/components/context/AlertContext'
import { useRouter } from 'next/navigation'
import ReusableModal from '@/components/modal/ReusableModal'

interface User {
  id: string
  name: string
  email: string
  image: string
  subscribed: boolean
  retreatOwner: boolean
  subscriptionType: 'platinum' | 'silver' | 'bronze'
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const { showAlert } = useAlert()
  const router = useRouter()
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deletingUserEmail, setDeletingUserEmail] = useState<string | null>(
    null
  )

  // ✅ NEW STATES
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [creatingUser, setCreatingUser] = useState(false)
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    profileImg: 'https://avatar.iran.liara.run/public/25',
  })

  const itemsPerPage = 10

  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiData = await getUsers(currentPage, itemsPerPage, searchQuery)
        setUsers(apiData.data)
        setTotalUsers(apiData.totalInDb)
      } catch (err: any) {
        setError('Failed to fetch user data.')
        setUsers([])
        setTotalUsers(0)
      } finally {
        setLoading(false)
      }
    }

    fetchUsersData()
  }, [currentPage, searchQuery])

  const handleSearchClick = () => {
    setCurrentPage(1)
    setSearchQuery(searchInput)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchQuery('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick()
    }
  }

  const totalPages = Math.ceil(totalUsers / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showAlert('success', 'Copied!', `Email "${text}" copied to clipboard.`)
  }

  const getActionMenus = (userId: string) => [
    {
      label: 'View',
      route: `/dashboard/users/${userId}`,
    },
    {
      label: 'Activate',
      onClick: () => alert(`Activated ${userId}`),
    },
    {
      label: 'Deactivate',
      onClick: () => alert(`Deactivated ${userId}`),
    },
  ]

  const handleFilesAdded = (files: File[]) => {
    setUploadedFiles(files)
  }

  const handleExtractData = async () => {
    if (uploadedFiles.length === 0) {
      showAlert('error', 'Error', 'Please upload a file first.')
      return
    }

    setIsExtracting(true)

    const file = uploadedFiles[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<any>(worksheet)

        const results = []
        const concurrencyLimit = 5 // Process 5 users at a time

        for (let i = 0; i < rows.length; i += concurrencyLimit) {
          const batch = rows.slice(i, i + concurrencyLimit)
          const batchPromises = batch.map(async (row) => {
            const email = String(row.Email || '').toLowerCase()

            try {
              // Step 1: Send verification code
              // await sendVerificationCode({ email, mode: "register" });

              // Step 2: Get OTP from admin endpoint
              // const otpResponse = await getUsersOtp(email);
              // const token = otpResponse.otp;
              // Step 3: Verify the token
              // await verifyToken({ email, token });

              // Step 4: Register the user
              await registerUser({
                phoneNumber: String(row.Phone || ''),
                email: email,
                firstName: String(row['First Name'] || ''),
                lastName: String(row['Last Name'] || ''),
                password: String(row.Password || '123456'),
                role: 'user',
                countryCode: 'NL',
                profileImg: String(row['Image link'] || ''),
              })

              return { status: 'success', email: email }
            } catch (err: any) {
              const reason = err.response?.data?.message || 'Unknown error'
              return { status: 'failed', email: email, reason: reason }
            }
          })
          // Wait for the current batch to complete before moving to the next
          results.push(...(await Promise.allSettled(batchPromises)))
        }

        const successfulRegistrations = results.filter(
          (r) =>
            r.status === 'fulfilled' && (r.value as any)?.status === 'success'
        )
        const failedRegistrations = results.filter(
          (r) =>
            r.status === 'fulfilled' && (r.value as any)?.status === 'failed'
        )

        if (
          successfulRegistrations.length > 0 ||
          failedRegistrations.length > 0
        ) {
          showAlert(
            'success',
            'Import Complete',
            `✅ Successfully registered ${successfulRegistrations.length} users. Failed to register ${failedRegistrations.length}.`
          )
        } else {
          showAlert(
            'info',
            'No Users Processed',
            'The uploaded file did not contain any valid users to process.'
          )
        }
      } catch (err: any) {
        showAlert('error', 'Error', 'An error occurred during file processing.')
      } finally {
        setIsExtracting(false)
        setShowUploadModal(false)
        setUploadedFiles([])
      }
    }

    reader.readAsArrayBuffer(file)
  }
  return (
    <div className="space-y-6">
      <ComponentCard title="All users">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="shadow-theme-xs relative flex h-11 w-full max-w-sm flex-grow items-center rounded-lg border border-gray-200 bg-transparent xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03]">
              <span className="flex-shrink-0 pr-2 pl-4">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search users by email"
                className="flex-grow bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-white/90 dark:placeholder:text-white/30"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                onKeyDown={handleKeyDown}
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <CloseLineIcon />
                </button>
              )}
              <button
                onClick={handleSearchClick}
                className="flex-shrink-0 rounded-r-lg bg-[#C06A4D] px-4 py-2 text-white transition-colors hover:bg-[#a6533c]"
                disabled={loading}
                aria-label="Search"
              >
                Search
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="rounded bg-[#C06A4D] px-4 py-2 text-white hover:bg-[#a6533c]"
              >
                Import Users
              </button>
              {/* ✅ NEW BUTTON */}
              <button
                onClick={() => setShowCreateUserModal(true)}
                className="rounded bg-[#54392A] px-4 py-2 text-white hover:bg-[#3e2a1f]"
              >
                Create User
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Circles
                height="80"
                width="80"
                color="#C06A4D"
                ariaLabel="circles-loading"
                visible={true}
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-[var(--app-bg)] dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="w-full overflow-x-auto">
                <div className="relative h-[100vh] min-w-[900px] overflow-y-auto">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          User
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          Email
                        </TableCell>

                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          Subscribed
                        </TableCell>

                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          Membership
                        </TableCell>

                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                          children={undefined}
                        />
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                          children={undefined}
                        />
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                          children={undefined}
                        />
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="px-5 py-4 text-start sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 overflow-hidden rounded-full">
                                  <Image
                                    className="h-full w-full object-cover"
                                    width={40}
                                    height={40}
                                    src={
                                      user.image || '/images/placeholder.jpg'
                                    }
                                    alt={user.name}
                                  />
                                </div>
                                <div>
                                  <span className="text-theme-sm block font-medium text-gray-800 dark:text-white/90">
                                    {user.name}
                                  </span>
                                  <span className="text-theme-xs block text-gray-500 dark:text-gray-400">
                                    {user.retreatOwner
                                      ? 'Retreat Owner'
                                      : 'Regular User'}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                              <div className="flex max-w-[220px] items-center gap-2 truncate">
                                <span className="truncate">{user.email}</span>
                                <button
                                  onClick={() => copyToClipboard(user.email)}
                                  className="flex-shrink-0 rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                                  aria-label="Copy email"
                                >
                                  <CopyIcon className="h-5 w-5 text-gray-500" />
                                </button>
                              </div>
                            </TableCell>

                            <TableCell className="px-4 py-3 text-start">
                              <Badge
                                size="sm"
                                color={user.subscribed ? 'success' : 'warning'}
                              >
                                {user.subscribed ? 'Yes' : 'No'}
                              </Badge>
                            </TableCell>

                            <TableCell className="px-4 py-3 text-start capitalize">
                              <Badge
                                size="sm"
                                color={
                                  user.subscriptionType === 'platinum'
                                    ? 'success'
                                    : user.subscriptionType === 'silver'
                                      ? 'warning'
                                      : 'default'
                                }
                              >
                                {user.subscriptionType || 'N/A'}
                              </Badge>
                            </TableCell>

                            <TableCell className="px-4 py-3 text-start">
                              {/* <ActionMenu items={getActionMenus(user.id)} children={undefined} /> */}
                              <button
                                onClick={() =>
                                  router.push(`/dashboard/users/${user.id}`)
                                }
                                className="rounded-md bg-[#C06A4D] px-3 py-1 text-xs font-medium text-white"
                              >
                                View
                              </button>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              {/* <ActionMenu items={getActionMenus(user.id)} children={undefined} /> */}
                              <button
                                onClick={() => {
                                  setSelectedUserId(user.id)
                                  setShowEditPasswordModal(true)
                                }}
                                className="rounded-md bg-[#54392A] px-3 py-1 text-xs font-medium text-white"
                              >
                                Edit
                              </button>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <button
                                onClick={() => {
                                  setDeletingUserId(user.id)
                                  setDeletingUserEmail(user.email)
                                  setShowDeleteModal(true)
                                }}
                                className="rounded-md bg-[#EB5757] px-3 py-1 text-xs font-medium text-white"
                              >
                                Delete
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell className="py-10 text-center text-gray-500">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="px-5 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </ComponentCard>

      {/* Upload Modal using ReusableModal */}
      <ReusableModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Import User Data"
      >
        <div className="p-6">
          <p className="mb-4 text-sm text-gray-600">
            <span className="font-semibold">Note:</span> Kindly ensure the
            template matches the required template for extraction
          </p>
          <FileUploader onFilesAdded={handleFilesAdded} />
          <div className="mt-4 text-center text-sm text-gray-600">
            Don’t have the right template?{' '}
            <a
              href="/templates/user_template.xlsx"
              download
              className="font-medium text-[#C06A4D] hover:underline"
            >
              Download Template
            </a>
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleExtractData}
            disabled={uploadedFiles.length === 0 || isExtracting}
            className={`rounded px-6 py-2 font-semibold transition ${uploadedFiles.length === 0 || isExtracting ? 'cursor-not-allowed bg-gray-400' : 'bg-[#C06A4D] text-white hover:bg-[#a6533c]'}`}
          >
            {isExtracting ? (
              <Circles
                height="20"
                width="20"
                color="#C06A4D"
                ariaLabel="circles-loading"
                visible={true}
              />
            ) : (
              'Extract Data'
            )}
          </button>
        </div>
      </ReusableModal>

      {/* Create User Modal using ReusableModal */}
      <ReusableModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        title="Create New User"
      >
        <div className="space-y-4 p-6">
          {[
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'password',
            'profileImg',
          ].map((f) => (
            <div key={f}>
              <label className="mb-1 block text-sm font-medium text-gray-700 capitalize">
                {f}
              </label>
              <input
                type={f === 'password' ? 'password' : 'text'}
                value={newUser[f as keyof typeof newUser]}
                onChange={(e) =>
                  setNewUser({ ...newUser, [f]: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#C06A4D]"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={async () => {
              if (!newUser.email || !newUser.firstName || !newUser.password) {
                showAlert(
                  'error',
                  'Missing Fields',
                  'Please fill all required fields.'
                )
                return
              }
              setCreatingUser(true)
              try {
                await registerUser({
                  phoneNumber: newUser.phoneNumber,
                  email: newUser.email.toLowerCase(),
                  firstName: newUser.firstName,
                  lastName: newUser.lastName,
                  password: newUser.password,
                  role: 'user',
                  countryCode: 'NL',
                  profileImg: newUser.profileImg,
                })
                showAlert(
                  'success',
                  'User Created',
                  `${newUser.email} registered successfully.`
                )
                setNewUser({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phoneNumber: '',
                  password: '',
                  profileImg: '',
                })
                setShowCreateUserModal(false)
              } catch (err: any) {
                const msg =
                  err.response?.data?.message || 'Failed to create user.'
                showAlert('error', 'Error', msg)
              } finally {
                setCreatingUser(false)
              }
            }}
            disabled={creatingUser}
            className={`rounded px-6 py-2 font-semibold transition ${creatingUser ? 'cursor-not-allowed bg-gray-400' : 'bg-[#C06A4D] text-white hover:bg-[#a6533c]'}`}
          >
            {creatingUser ? (
              <Circles
                height="20"
                width="20"
                color="#fff"
                ariaLabel="loading"
                visible
              />
            ) : (
              'Create User'
            )}
          </button>
        </div>
      </ReusableModal>

      <ReusableModal
        isOpen={showEditPasswordModal}
        onClose={() => {
          setShowEditPasswordModal(false)
          setNewPassword('')
          setSelectedUserId(null)
        }}
        title="Update User Password"
      >
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={'text'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#C06A4D]"
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={async () => {
              if (!selectedUserId || !newPassword) {
                showAlert(
                  'error',
                  'Missing Fields',
                  'Please enter a new password.'
                )
                return
              }
              setPasswordLoading(true)
              try {
                await updateUserPassword(selectedUserId, newPassword)
                showAlert(
                  'success',
                  'Password Updated',
                  'User password updated successfully.'
                )
                setShowEditPasswordModal(false)
                setNewPassword('')
              } catch (err: any) {
                showAlert(
                  'error',
                  'Error',
                  err.response?.data?.message || 'Failed to update password.'
                )
              } finally {
                setPasswordLoading(false)
              }
            }}
            disabled={passwordLoading}
            className={`rounded px-6 py-2 font-semibold transition ${
              passwordLoading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-[#C06A4D] text-white hover:bg-[#a6533c]'
            }`}
          >
            {passwordLoading ? (
              <Circles
                height="20"
                width="20"
                color="#fff"
                ariaLabel="loading"
                visible
              />
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </ReusableModal>

      <ReusableModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingUserId(null)
          setDeletingUserEmail(null)
        }}
        title="Confirm Delete"
      >
        <div className="space-y-4 p-6 text-center">
          <p className="text-gray-700">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{deletingUserEmail}</span>?<br />
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-center gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={() => {
              setShowDeleteModal(false)
              setDeletingUserId(null)
              setDeletingUserEmail(null)
            }}
            className="rounded bg-gray-300 px-6 py-2 font-semibold text-gray-800 transition hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              if (!deletingUserId) return
              setDeleting(true)
              try {
                await deleteUser(deletingUserId)
                showAlert(
                  'success',
                  'User Deleted',
                  `${deletingUserEmail} has been removed.`
                )
                setUsers(users.filter((u) => u.id !== deletingUserId))
                setShowDeleteModal(false)
              } catch (err: any) {
                showAlert(
                  'error',
                  'Error',
                  err.response?.data?.message || 'Failed to delete user.'
                )
              } finally {
                setDeleting(false)
              }
            }}
            disabled={deleting}
            className={`rounded px-6 py-2 font-semibold transition ${
              deleting
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-[#EB5757] text-white hover:bg-red-700'
            }`}
          >
            {deleting ? (
              <Circles
                height="20"
                width="20"
                color="#fff"
                ariaLabel="loading"
                visible
              />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </ReusableModal>
    </div>
  )
}

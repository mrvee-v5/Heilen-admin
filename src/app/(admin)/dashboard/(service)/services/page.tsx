'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
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
import { getServices, getPublishRequests, updatePublishStatus, reviewPublishRequest } from '@/services/services.service'
import { Service, PublishRequest } from '@/services/types'
import { useRouter } from 'next/navigation'
import { Circles } from 'react-loader-spinner'
import { useAlert } from '@/components/context/AlertContext'
import { Modal } from '@/components/ui/modal'

export default function ServicesTable() {
  const router = useRouter()
  const { showAlert } = useAlert()
  const [services, setServices] = useState<Service[]>([])
  const [publishRequests, setPublishRequests] = useState<PublishRequest[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'services' | 'requests'>('services')

  const [isReviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [isSubmittingReview, setSubmittingReview] = useState(false)

  const fetchServices = async (pageIndex: number, pageSize: number) => {
    try {
      setLoading(true)
      const response = await getServices(pageIndex, pageSize)
      setServices(response.data)
      setTotalPages(Math.ceil(response.totalInDb / pageSize))
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPublishRequests = async (pageIndex: number, pageSize: number) => {
    try {
      setLoading(true)
      const response = await getPublishRequests(pageIndex, pageSize)
      setPublishRequests(response.data)
      setTotalPages(Math.ceil(response.totalInDb / pageSize))
    } catch (error) {
      console.error('Error loading publish requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices(currentPage, itemsPerPage)
    } else {
      fetchPublishRequests(currentPage, itemsPerPage)
    }
  }, [currentPage, activeTab])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleReviewSubmit = async (remark: string, approved: boolean) => {
    if (!selectedServiceId) return
    try {
      setSubmittingReview(true)
      await reviewPublishRequest(selectedServiceId, approved, remark)
      showAlert(
        'success',
        'Review submitted',
        approved
          ? 'Service has been approved and published successfully.'
          : 'Service request has been rejected.'
      )
      // Refresh the list
      fetchPublishRequests(currentPage, itemsPerPage)
      setReviewModalOpen(false)
    } catch (error:any) {
      console.error('Error submitting review:', error)
      showAlert('error', 'Error submitting review', error.response && error.response.data.message || "Something went wrong")
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Circles height={50} width={50} color="#C06A4D" />
      </div>
    )
  }

  const data = activeTab === 'services' ? services : publishRequests


 const getStatusColor = (status) => {
    if (status === "publish") {
        return "success";  // Green for "publish"
    } else if (status === "Unpublished") {
        return "error"; // Red or gray for "Unpublished"
    } else {
        return "default"; // Default color for unknown status
    }
};

  return (
    <div className="space-y-6">
      <ComponentCard title="Retreats">
        <div className="flex gap-4 border-b border-gray-200 pb-2 mb-4">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === 'services'
                ? 'text-[#C06A4D] border-b-2 border-[#C06A4D]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Services
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === 'requests'
                ? 'text-[#C06A4D] border-b-2 border-[#C06A4D]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Requests
          </button>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-[var(--app-bg)] dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="w-full overflow-x-auto">
              <div className="relative min-w-[1000px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="sticky top-0 z-10 bg-[var(--app-bg)] dark:bg-white/[0.03]">
                      <TableCell isHeader className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400">
                        Service Name
                      </TableCell>
                      <TableCell isHeader className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400">
                        Price
                      </TableCell>
                      {activeTab === 'services' && (
                        <TableCell isHeader className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400">
                          Total Booked
                        </TableCell>
                      )}
                      <TableCell isHeader className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400">
                        Status
                      </TableCell>
                      <TableCell isHeader className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400">
                        Business
                      </TableCell>
                      <TableCell isHeader className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400">
                        Owner
                      </TableCell>
                      <TableCell isHeader className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {data.length > 0 ? (
                      activeTab === 'services' ? (
                        services.map((service) => (
                          <TableRow key={service.serviceId}>
                            <TableCell className="px-5 py-4 text-start max-w-[200px]">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
                                  <Image
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                    src={service.defaultImage || 'https://avatar.iran.liara.run/public/26'}
                                    alt={service.serviceName}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-800 dark:text-white break-words">
                                  {service.serviceName}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                              {service.price !== null && service.price !== undefined
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 2,
                                  }).format(service.price)
                                : 'N/A'}
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start">
                              <Badge size="sm" color={service.totalBooked > 0 ? 'info' : 'warning'}>
                                {service.totalBooked}
                              </Badge>
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start">
                          <Badge
  color={getStatusColor(service.status)}
  size="sm"
>
  {service.status === 'publish' ? 'Published' : 'Unpublished'}
</Badge>
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                              {service.businessName || 'N/A'}
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                              {service.owner?.name || 'N/A'}
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start">
                              <button
                                onClick={() => router.push(`/dashboard/services/${service.serviceId}`)}
                                className="rounded-md bg-[#C06A4D] px-3 py-1 text-xs font-medium text-white"
                              >
                                View
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        publishRequests.map((req) => (
                          <TableRow key={req.id}>
                            <TableCell className="px-5 py-4 text-start max-w-[200px]">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
                                  <Image
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                    src={req.service.defaultImage || 'https://avatar.iran.liara.run/public/26'}
                                    alt={req.service.name}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-800 dark:text-white break-words">
                                  {req.service.name}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: req.service.currency || 'EUR',
                                minimumFractionDigits: 2,
                              }).format(Number(req.service.price))}
                            </TableCell>

                            {/* We skip Total Booked for publish requests */}
                            <TableCell className="px-5 py-4 text-start">
                              <Badge size="sm" color="warning">
                                Pending Review
                              </Badge>
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                              {req.business.name || 'N/A'}
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                              {req.business.owner?.name || 'N/A'}
                            </TableCell>

                            <TableCell className="px-5 py-4 text-start space-x-2">
                              <button
                                onClick={() => router.push(`/dashboard/services/${req.service.id}`)}
                                className="rounded-md bg-[#C06A4D] px-3 py-1 text-xs font-medium text-white"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedServiceId(req.service.id)
                                  setReviewModalOpen(true)
                                }}
                                className="rounded-md border border-[#C06A4D] px-3 py-1 text-xs font-medium text-[#C06A4D] hover:bg-[#C06A4D]/10"
                              >
                                Review
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      )
                    ) : (
                      <TableRow>
                        <TableCell className="px-5 py-4 text-center text-sm text-gray-600 dark:text-gray-400" colSpan={8}>
                          {activeTab === 'services'
                            ? 'No services found.'
                            : 'No pending publish requests found.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="px-5 py-3">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </div>
        </div>
      </ComponentCard>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        isLoading={isSubmittingReview}
      />
    </div>
  )
}

// Review Modal Component
const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (remark: string, approved: boolean) => void
  isLoading: boolean
}) => {
  const [remark, setRemark] = useState('')
  const [approved, setApproved] = useState<boolean | null>(null)

  if (!isOpen) return null

  return (
    <Modal 
    isOpen={isOpen} 
    onClose={onClose}
     className="m-4 max-w-[420px]"
         showCloseButton={false}
     >
      <div className="bg-white rounded-lg shadow-lg dark:bg-gray-900">
        <div className="flex items-center justify-between bg-[#54392A] px-5 py-3">
          <h4 className="text-lg font-semibold text-white">Review Request</h4>
          <button onClick={onClose} className="text-white hover:text-gray-300">✕</button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remark (required)</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-[#C06A4D] focus:ring-[#C06A4D] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Decision</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="decision"
                  value="approve"
                  checked={approved === true}
                  onChange={() => setApproved(true)}
                />
                Approve (Publish)
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="decision"
                  value="reject"
                  checked={approved === false}
                  onChange={() => setApproved(false)}
                />
                Reject
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm font-medium">
              Cancel
            </button>
            <button
              onClick={() => {
                if (remark.trim() && approved !== null) {
                  onSubmit(remark, approved)
                }
              }}
              disabled={!remark.trim() || approved === null || isLoading}
              className="rounded-md bg-[#C06A4D] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

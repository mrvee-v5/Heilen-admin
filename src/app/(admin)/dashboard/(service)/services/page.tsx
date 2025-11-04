'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import ActionMenu from '@/components/common/ActionMenu'
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
import { getServices } from '@/services/services.service'
import { Service } from '@/services/types'
import { useRouter } from 'next/navigation'
import { Circles } from 'react-loader-spinner'

export default function ServicesTable() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    fetchServices(currentPage, itemsPerPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  // Action menus for each service row
  const ActionMenus = (serviceId: string) => [
    { label: 'View', route: `/dashboard/services/${serviceId}` },
    { label: 'Approve', onClick: () => alert(`Approved ${serviceId}`) },
    { label: 'Reject', onClick: () => alert(`Rejected ${serviceId}`) },
    { label: 'Edit', route: `/service-detail/${serviceId}` },
  ]

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Circles height={50} width={50} color="#C06A4D" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* <ServiceOptionDropdown /> */}
      <ComponentCard title="Retreats">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-[var(--app-bg)] dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Scrollable wrapper */}
            <div className="w-full overflow-x-auto">
              <div className="relative h-[100vh] min-w-[900px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="sticky top-0 z-10 bg-[var(--app-bg)] dark:bg-white/[0.03]">
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                      >
                        Service
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                      >
                        Category
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                      >
                        Price
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                      >
                        Total Booked
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {services.length > 0 ? (
                      services.map((service) => (
                        <TableRow key={service.serviceId}>
                          <TableCell className="px-5 py-4 text-start">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 overflow-hidden rounded-full">
                                <Image
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                  src={
                                    service.defaultImage ||
                                    'https://avatar.iran.liara.run/public/26'
                                  }
                                  alt={service.serviceName}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-800 dark:text-white">
                                {service.serviceName}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                            {service.serviceCategory?.name || 'N/A'}
                          </TableCell>

                          <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                            {service.price ? `€${service.price}` : 'N/A'}
                          </TableCell>

                          <TableCell className="px-5 py-4 text-start">
                            <Badge
                              size="sm"
                              color={
                                service.totalBooked > 0 ? 'info' : 'warning'
                              }
                            >
                              {service.totalBooked}
                            </Badge>
                          </TableCell>

                          <TableCell className="px-5 py-4 text-start">
                            {/* <ActionMenu items={ActionMenus(service.serviceId)} children={undefined} /> */}

                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/services/${service.serviceId}`
                                )
                              }
                              className="rounded-md bg-[#C06A4D] px-3 py-1 text-xs font-medium text-white"
                            >
                              View
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className="px-5 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                          No services found.
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
        </div>
      </ComponentCard>
    </div>
  )
}

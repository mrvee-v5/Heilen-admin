'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Badge from '../ui/badge/Badge'
import Image from 'next/image'
import { MoreDotIcon } from '@/icons'
import { Dropdown } from '../ui/dropdown/Dropdown'
import { DropdownItem } from '../ui/dropdown/DropdownItem'
import Pagination from './Pagination'
import Link from 'next/link'
import ActionMenu from '../common/ActionMenu'

// Action dropdown component

// Updated mock data without startDate and endDate
const tableData = [
  {
    id: 1,
    name: 'Alpha Product',
    image: '/images/user/user-17.jpg',
    location: 'New York',
    status: 'Active',
    approvalStatus: 'Approved',
    duration: '1 month',
    price: '$199',
  },
  {
    id: 2,
    name: 'Beta Product',
    image: '/images/user/user-17.jpg',
    location: 'Los Angeles',
    status: 'Closed',
    approvalStatus: 'Rejected',
    duration: '1 month',
    price: '$149',
  },
  {
    id: 3,
    name: 'Gamma Product',
    image: '/images/user/user-17.jpg',
    location: 'Chicago',
    status: 'Active',
    approvalStatus: 'Approved',
    duration: '1 month',
    price: '$129',
  },
]

export default function BasicTableOne() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(tableData.length / itemsPerPage)
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const ActionMenus = [
    {
      label: 'View',
      route: '/dashboard/service-preview',
    },
    {
      label: 'Approve',
      onClick: () => alert(`Activated `),
    },
    {
      label: 'Reject',
      onClick: () => alert(`Activated `),
    },
    {
      label: 'Edit',
      route: '/service-detail',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-[var(--app-bg)] dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Scrollable wrapper */}
        <div className="w-full overflow-x-auto">
          <div className="max-h-[400px] min-w-[1000px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 z-10 bg-[var(--app-bg)] dark:bg-white/[0.03]">
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                  >
                    Retreat name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                  >
                    Location
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                  >
                    Approval Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start text-gray-500 dark:text-gray-400"
                  >
                    Duration
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
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={item.image}
                            alt={item.name}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {item.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                      {item.location}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={item.status === 'Active' ? 'success' : 'error'}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={
                          item.approvalStatus === 'Approved' ? 'info' : 'error'
                        }
                      >
                        {item.approvalStatus}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                      {item.duration}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start text-sm text-gray-600 dark:text-gray-400">
                      {item.price}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      <ActionMenu items={ActionMenus} children={undefined} />
                    </TableCell>
                  </TableRow>
                ))}
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
  )
}

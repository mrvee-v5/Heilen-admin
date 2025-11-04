'use client'
import ActionMenu from '@/components/common/ActionMenu'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table'
import React, { useState } from 'react'
import Image from 'next/image'
import ComponentCard from '@/components/common/ComponentCard'

/* ---------- Updated mock data ---------- */
const tableData = [
  {
    id: 1,
    bookingId: 'BK-2025-001',
    name: 'Peaceful Mountain Retreat',
    image: '/images/user/user-17.jpg',
    date: '2025-11-10',
    duration: '5 days',
    price: 499,
    discount: 50,
    hasAddon: true,
  },
  {
    id: 2,
    bookingId: 'BK-2025-002',
    name: 'Beachside Wellness',
    image: '/images/user/user-18.jpg',
    date: '2026-01-15',
    duration: '7 days',
    price: 899,
    discount: 100,
    hasAddon: true,
  },
  {
    id: 3,
    bookingId: 'BK-2025-003',
    name: 'Forest Healing Camp',
    image: '/images/user/user-19.jpg',
    date: '2026-03-02',
    duration: '4 days',
    price: 699,
    discount: 0,
    hasAddon: false,
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
      onClick: () => alert(`Viewed `),
    },
  ]

  return (
    <div className="space-y-6">
      <ComponentCard title="Bookings">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-[var(--app-bg)] dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="w-full overflow-x-auto">
              <div className="max-h-[400px] min-w-[1000px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="sticky top-0 z-10 bg-[var(--app-bg)] dark:bg-white/[0.03]">
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500"
                      >
                        Retreat Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500"
                      >
                        Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500"
                      >
                        Duration
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500"
                      >
                        Price
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500"
                      >
                        Discount
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500"
                      >
                        Has Addons
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500"
                      >
                        Total Amount
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500"
                      >
                        Booking ID
                      </TableCell>
                      <TableCell
                        isHeader
                        className="text-theme-xs px-5 py-3 text-start text-gray-500"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {paginatedData.map((item) => {
                      const total = item.price - item.discount
                      return (
                        <TableRow key={item.id}>
                          {/* Retreat name with image */}
                          <TableCell className="px-5 py-4 text-start">
                            <div className="flex items-center gap-3">
                              {/* <div className="w-10 h-10 overflow-hidden rounded-full">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={item.image}
                                                            alt={item.name}
                                                        />
                                                    </div> */}
                              <span className="text-sm font-medium text-gray-800 dark:text-white">
                                {item.name}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="px-5 py-4 text-sm text-gray-600">
                            {item.date}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-600">
                            {item.duration}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-600">
                            ${item.price}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-600">
                            ${item.discount}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-600">
                            {item.hasAddon ? 'Yes' : 'No'}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm font-semibold text-gray-900">
                            ${total}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-600">
                            {item.bookingId}
                          </TableCell>

                          <TableCell className="px-5 py-4 text-start">
                            <ActionMenu
                              items={ActionMenus}
                              children={undefined}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
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

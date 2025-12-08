// import type { Metadata } from 'next'
// import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
// import React from 'react'


// export default function Ecommerce() {
//   return (
//     <div className="grid grid-cols-12 gap-4 md:gap-6">
//       <div className="col-span-12 space-y-6">
//         <EcommerceMetrics />
//       </div>
 
//     </div>
//   )
// }



'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'
import Pagination from '@/components/tables/Pagination'
import ComponentCard from '@/components/common/ComponentCard'
import { Circles } from 'react-loader-spinner'
import { getEvents } from '@/services/services.service'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'

const SEVERITY_TYPES = ['INFO', 'WARNING', 'ERROR', 'CRITICAL']

interface EventData {
  id: string
  eventType: string
  eventData: any
  severity: string
  user?: { id: string; name: string; email: string } | null
  metadata?: {
    platform?: string
    deviceModel?: string
    osVersion?: string
    appVersion?: string
    timestamp?: string
  }
  createdDate?: string
}

interface User {
  id: string
  name: string
  email: string
}

export default function EventsTable() {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])

  // Filters
  const [eventType, setEventType] = useState('')
  const [severity, setSeverity] = useState('')
  const [userId, setUserId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalEvents, setTotalEvents] = useState(0)

  const fetchEventsData = async () => {
    setLoading(true)
    try {
      const response = await getEvents({
        pageIndex: currentPage,
        pageSize,
        eventType: eventType || undefined,
        severity: severity || undefined,
        userId: userId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
      setEvents(response.data)
      setTotalEvents(response.total)
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventsData()
  }, [currentPage, pageSize, eventType, severity, userId, startDate, endDate])

  const totalPages = Math.ceil(totalEvents / pageSize)

  const handleResetFilters = () => {
    setEventType('')
    setSeverity('')
    setUserId('')
    setStartDate('')
    setEndDate('')
  }

  const formatSeverity = (severity: string) => {
  if (!severity) return 'N/A'
  return severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()
}

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') return 'N/A'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return value
  }

  return (
    <div className="space-y-6">

    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
         <EcommerceMetrics />
       </div>
 
     </div>
      <ComponentCard title="All Events">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-[#C06A4D]"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">All Event Types</option>
            <option value="LOG">Log</option>
            <option value="CRASH">Crash</option>
            <option value="USER_CREATION">User Creation</option>
            <option value="USER_LOGIN">User Login</option>
            <option value="USER_LOGOUT">User Logout</option>
            <option value="BOOKING_CREATED">Booking Created</option>
            <option value="BOOKING_CANCELLED">Booking Cancelled</option>
            <option value="SERVICE_PUBLISHED">Service Published</option>
            <option value="PAYMENT_COMPLETED">Payment Completed</option>
            <option value="ERROR">Error</option>
            <option value="PAGE_VIEW">Page View</option>
            <option value="BUTTON_CLICKED">Button Clicked</option>
          </select>

          <select
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-[#C06A4D]"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="">All Severities</option>
            {SEVERITY_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-[#C06A4D]"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-[#C06A4D]"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-[#C06A4D]"
          />
          <button
            onClick={handleResetFilters}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Circles height="80" width="80" color="#C06A4D" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/[0.05]">
            <Table>
              <TableHeader className="border-b border-gray-100">
                <TableRow>
                  <TableCell className="text-sm text-gray-500 font-medium px-5 py-3">
                    Severity
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 font-medium px-5 py-3">
                    Event Data
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 font-medium px-5 py-3">
                    User
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 font-medium px-5 py-3">
                    Platform / Device
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 font-medium px-5 py-3">
                    OS / App Version
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 font-medium px-5 py-3">
                    Timestamp
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {events.length > 0 ? (
                  events.map((ev) => (
                    <TableRow key={ev.id} className="">
                      <TableCell className="px-5 py-4">
                        {}
                        <Badge //@ts-ignore
  color={
    ev.severity === 'INFO'
      ? 'success'
      : ev.severity === 'WARNING'
      ? 'warning'
      : ev.severity === 'ERROR'
      ? 'error'
      : 'critical'
  }
>
  {formatSeverity(ev.severity)}
</Badge>

                      </TableCell>

<TableCell className="px-5 py-4 max-w-[400px]">
  {ev.eventData ? (
    <div className="overflow-x-auto bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 text-xs text-gray-700 dark:text-gray-300 font-mono">
      {Object.entries(ev.eventData).map(([key, value], idx) => (
        <div key={idx} className="mb-1">
          <span className="text-gray-500">{key}:</span>{' '}
          <span className="text-gray-800 dark:text-gray-100">
            {value === null || value === undefined || value === ''
              ? 'N/A'
              : value.toString()}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <span className="text-gray-400 text-sm">N/A</span>
  )}
</TableCell>



                      <TableCell className="px-5 py-4 text-gray-700">
                        {ev.user
                          ? `${formatValue(ev.user.name)} (${formatValue(
                              ev.user.email
                            )})`
                          : 'N/A'}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-gray-700">
                        {ev.metadata
                          ? `${formatValue(ev.metadata.platform)} / ${formatValue(
                              ev.metadata.deviceModel
                            )}`
                          : 'N/A'}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-gray-700">
                        {ev.metadata
                          ? `${formatValue(ev.metadata.osVersion)} / ${formatValue(
                              ev.metadata.appVersion
                            )}`
                          : 'N/A'}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-gray-700">
                        {ev.metadata && ev.metadata.timestamp
                          ? new Date(ev.metadata.timestamp).toLocaleString()
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell //@ts-ignore
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      No events found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="px-5 py-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}
      </ComponentCard>
    </div>
  )
}

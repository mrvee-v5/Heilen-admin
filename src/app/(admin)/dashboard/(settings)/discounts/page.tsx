'use client'
import React, { useEffect, useState } from 'react'
import {
  getDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  toggleDiscountCodeStatus,
} from '@/services/discountCodes.service'
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
import ReusableModal from '@/components/modal/ReusableModal'
import { Circles } from 'react-loader-spinner'
import { useAlert } from '@/components/context/AlertContext'

interface DiscountCode {
  id: string
  code: string
  discountPercent: string
  validFrom: string
  validUntil: string
  maxUses: number
  isActive: boolean
}

export default function DiscountCodesTable() {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null)
  const { showAlert } = useAlert()

  const itemsPerPage = 10
  const totalPages = Math.ceil(total / itemsPerPage)

  const [form, setForm] = useState({
    code: '',
    discountPercent: '',
    validFrom: '',
    validUntil: '',
    maxUses: 1,
    isActive: false,
  })

  // CTA loaders
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // ==========================
  // FETCH CODES
  // ==========================
  const fetchCodes = async () => {
    try {
      setLoading(true)
      const res = await getDiscountCodes(currentPage, itemsPerPage)
      setCodes(res.data)
      setTotal(res.total)
    } catch {
      showAlert('error', 'Error', 'Failed to fetch discount codes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCodes()
  }, [currentPage])

  // ==========================
  // CREATE
  // ==========================
  const handleCreate = async () => {
    
    try {
      setCreating(true)
      await createDiscountCode(form)
      showAlert('success', 'Created', 'Discount code created')
      setShowCreateModal(false)
      fetchCodes()
    } catch {
      showAlert('error', 'Error', 'Failed to create discount code')
    } finally {
      setCreating(false)
    }
  }

  // ==========================
  // UPDATE
  // ==========================
  const handleUpdate = async () => {
    if (!selectedCode) return
    try {
      setUpdating(true)
      await updateDiscountCode(selectedCode.id, form)
      showAlert('success', 'Updated', 'Discount code updated')
      setShowEditModal(false)
      fetchCodes()
    } catch {
      showAlert('error', 'Error', 'Failed to update discount code')
    } finally {
      setUpdating(false)
    }
  }

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async () => {
    if (!selectedCode) return
    try {
      setDeleting(true)
      await deleteDiscountCode(selectedCode.id)
      showAlert('success', 'Deleted', 'Discount code deleted')
      setShowDeleteModal(false)
      fetchCodes()
    } catch {
      showAlert('error', 'Error', 'Failed to delete discount code')
    } finally {
      setDeleting(false)
    }
  }

  // ==========================
  // TOGGLE ACTIVE
  // ==========================
  const handleToggle = async (code: DiscountCode) => {
    try {
      setTogglingId(code.id)
      await toggleDiscountCodeStatus(code.id, !code.isActive)
      fetchCodes()
    } catch {
      showAlert('error', 'Error', 'Failed to toggle status')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <ComponentCard title="Discount Codes">
      <div className="flex justify-end mb-4">
        <button
          onClick={() =>{ 
            setForm({
              code: '',
              discountPercent: '',
              validFrom: '',
              validUntil: '',
              maxUses: 1,
              isActive: false
            })
            setShowCreateModal(true)
          }}
          className="rounded bg-[#54392A] px-4 py-2 text-white"
        >
          Create Discount Code
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Circles height="60" width="60" color="#C06A4D" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/[0.05]">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                  Code
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                  Discount
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                  Valid Period
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                  Max Uses
                </TableCell>
                <TableCell isHeader className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                  Status
                </TableCell>
                <TableCell isHeader className="px-4 py-3 w-[90px]" children/>
                <TableCell isHeader className="px-4 py-3 w-[70px]" children/>
                <TableCell isHeader className="px-4 py-3 w-[80px]" children/>
              </TableRow>
            </TableHeader>

            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="px-4 py-3 text-sm font-medium text-gray-800">
                    {code.code}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {code.discountPercent}%
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {new Date(code.validFrom).toLocaleDateString()} –{' '}
                    {new Date(code.validUntil).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {code.maxUses}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge size="sm" color={code.isActive ? 'success' : 'warning'}>
                      {code.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-right">
            <button
  onClick={() => handleToggle(code)}
  disabled={togglingId === code.id}
  className="rounded-md bg-[#C06A4D]/10 px-3 py-1 text-xs font-medium text-[#C06A4D] flex justify-center"
>
  {togglingId === code.id ? (
    <Circles height="16" width="16" color="#C06A4D" />
  ) : code.isActive ? (
    'Deactivate'
  ) : (
    'Activate'
  )}
</button>

                  </TableCell>

                  <TableCell className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedCode(code)
                        setForm(code)
                        setShowEditModal(true)
                      }}
                      className="rounded-md bg-[#54392A]/10 px-3 py-1 text-xs font-medium text-[#54392A]"
                    >
                      Edit
                    </button>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedCode(code)
                        setShowDeleteModal(true)
                      }}
                      className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <ReusableModal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false)
          setShowEditModal(false)
        }}
        title={showEditModal ? 'Edit Discount Code' : 'Create Discount Code'}
      >
        <div className="space-y-3 p-6">
          {['code', 'discountPercent', 'validFrom', 'validUntil', 'maxUses'].map(
            (field) => (
              <input
                key={field}
                type={field.includes('valid') ? 'datetime-local' : 'text'}
                value={(form as any)[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="w-full rounded border p-2"
              />
            )
          )}
          <button
            onClick={showEditModal ? handleUpdate : handleCreate}
            disabled={creating || updating}
            className="w-full rounded bg-[#C06A4D] py-2 text-white flex justify-center"
          >
            {creating || updating ? (
              <Circles height="20" width="20" color="#fff" />
            ) : showEditModal ? (
              'Update'
            ) : (
              'Create'
            )}
          </button>
        </div>
      </ReusableModal>

      {/* DELETE MODAL */}
      <ReusableModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Discount Code"
      >
        <div className="p-6 text-center">
          <p>Are you sure you want to delete this code?</p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded bg-[#EB5757] px-4 py-2 text-white flex justify-center"
            >
              {deleting ? (
                <Circles height="18" width="18" color="#fff" />
              ) : (
                'Delete'
              )}
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="rounded bg-gray-300 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </ReusableModal>
    </ComponentCard>
  )
}

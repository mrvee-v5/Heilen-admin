import React from 'react'
import RichTextEditor from '../common/RichTextEditor'

interface PreviewCardProps {
  label?: string
  value: string
  icon?: React.ReactNode
  prefix?: string
  isHtml?: boolean
  editable?: boolean
  onChange?: (newValue: string) => void
  textarea?: boolean
  inputType?: 'text' | 'date' | 'time' | any
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  label,
  prefix,
  value,
  icon,
  isHtml,
  editable = false,
  onChange,
  textarea = false,
  inputType = 'text',
}) => {
  // Convert "07:00 AM" → "07:00" for <input type="time">
  const convertToTimeInput = (timeWithAmPm: string) => {
    if (!timeWithAmPm) return ''
    const [time, modifier] = timeWithAmPm.split(' ') // "07:00 AM"
    let [hours, minutes] = time.split(':').map(Number)

    if (modifier === 'PM' && hours < 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  // Convert "07:00" back → "07:00 AM" when saving
  const convertFromTimeInput = (time: string) => {
    if (!time) return ''
    let [hours, minutes] = time.split(':').map(Number)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    if (hours > 12) hours -= 12
    if (hours === 0) hours = 12
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`
  }

  return (
    <div className="mb-4 w-full">
      {label && <p className="mb-1 text-sm text-[#54392A]">{label}</p>}
      <div className="flex w-full items-start rounded border border-gray-300 bg-[var(--app-bg)] p-3">
        {prefix && <span className="mr-2 shrink-0 font-medium">{prefix}</span>}

        <div className="w-full flex-1 text-sm text-[#54392A]">
          {editable ? (
            isHtml ? (
              <RichTextEditor
                value={value}
                onChange={(val) => onChange?.(val)}
              />
            ) : textarea ? (
              <textarea
                className="w-full resize-y rounded border border-gray-300 p-2"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                rows={3}
              />
            ) : inputType === 'time' ? (
              <input
                type="time"
                value={convertToTimeInput(value)} // ✅ Normalize for input
                onChange={
                  (e) => onChange?.(convertFromTimeInput(e.target.value)) // ✅ Store back with AM/PM
                }
                className="w-full rounded border border-gray-300 p-2"
              />
            ) : (
              <input
                type={inputType}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full rounded border border-gray-300 p-2"
              />
            )
          ) : isHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: value }}
              className="prose w-full"
            />
          ) : (
            <span className="block w-full">{value}</span>
          )}
        </div>

        {icon && <div className="ml-2 shrink-0">{icon}</div>}
      </div>
    </div>
  )
}

export default PreviewCard

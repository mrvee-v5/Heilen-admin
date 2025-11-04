// src/services/types.ts

export interface User {
  id: string
  name: string
  email: string
  image: string
  subscribed: boolean
  retreatOwner: boolean
  subscriptionType: 'platinum' | 'silver' | 'bronze'
}

export interface UsersApiResponse {
  data: User[]
  totalInDb: number
}

export interface RegisterUserPayload {
  phoneNumber: string
  email: string
  firstName: string
  lastName: string
  password: string
  profileImgURL: string
}

export interface BusinessAddress {
  country: string
  state: string
  city: string
  postalCode: string
  fullAddress: string
}

export interface BusinessMedia {
  id: string
  mediaURL: string
  order: number | null
  createdDate: string
  updatedDate: string
  deletedDate: string | null
}

export interface Business {
  media: BusinessMedia[] // ✅ updated
  id: string
  businessName: string
  role: string | null
  businessAddress: BusinessAddress
  businessPhoneNumber: string
  businessEmail: string
  vitualAddress: boolean
  govtReg: string | null
  instagramHandle: string | null
  hearAboutUs: string | null
  shortDescription: string
  shortProfileLink: string
  fullProfileLink: string
  description: string
  isPublished: boolean
  professions: string[]
  profileImg: string
  availableCountries: string[]
  allowB2B: boolean
  allowChat: boolean
  buinessB2BKeywords: string[]
  clientB2BKeywords: string[] | null
  TC: string
  deleted: boolean
  createdDate: string
  updatedDate: string
  deletedDate: string | null
}

export interface Staff {
  id: string
  profession: string | null
  calenderColor: string
  startDate: string | null
  available: boolean
  endDate: string | null
  appointmentId: string | null
  availableHours: string | null
  createdDate: string
  updatedDate: string
  deletedDate: string | null
}

export interface Verification {
  id: string
  email: string
  phoneNumber: string | null
  phoneToken: string | null
  phoneTokenExpiry: string | null
  emailToken: string | null
  emailTokenExpiry: string
  isPhoneVerified: boolean
  isEmailVerified: boolean
  createdDate: string
  updatedDate: string
  deletedDate: string | null
}

export interface UserDetail {
  subscriptionStatus: any
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  phoneNumber: string | null
  dob: string
  profileImg: string
  countryCode: string
  location: string
  deviceToken: string
  subscribed: boolean
  subscriptionType: 'platinum' | 'silver' | 'bronze'
  hasBusiness: boolean
  isStaff: boolean
  isThirdParty: boolean
  createdDate: string
  updatedDate: string
  deletedDate: string | null
  business: Business
  staff?: Staff
  verification?: Verification
  appointments: any[]
}

export interface ServiceCategory {
  id: string
  name: string
  description?: string | null
  thumbnailIcon?: string | null
  createdDate: string
  updatedDate: string
  deletedDate?: string | null
}

export interface Service {
  serviceId: string
  serviceName: string
  serviceCategory: ServiceCategory
  price: string
  totalBooked: number
  defaultImage?: string
}

export interface ServicesApiResponse {
  data: Service[]
  totalInDb: number
}

export interface CreateServicePayload {
  serviceName: string
  serviceCategoryId: string
  price: string
  defaultImage?: string
}

export interface ServiceMedia {
  id: string
  mediaURL: string
  order: number
}

export interface ServiceLocation {
  name: string
  country: string
  city: string
  state: string
  fullAddress: string
  postalCode?: string
  description?: string
  latitude: string
  longitude: string
}

export interface ServiceAddOn {
  id: string
  name: string
  currency: string
  price: number
  description: string
  media: string[]
  availableSlots: number
}

export interface ServiceFutureDate {
  id: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  slot: string
  isLimitless: boolean
  createdDate: string
  updatedDate: string
  deletedDate?: string | null
  availableSlots: number
  addOns: ServiceAddOn[]
}

export interface Professional {
  id: string
  name: string
  image: string
  role?: string | null
}

export interface ServiceDetail {
  id: string
  name: string
  description: string
  textDescription: string
  foodCatalog: string
  accomodation: string
  benefit: string
  program: string
  currency: string
  VAT: number
  activeDiscount: boolean
  discount: number
  discountTo: string
  discountedPrice: number
  price: number
  isFavourite: boolean
  includedDetails: string
  excludedDetails: string
  audience: string
  reason: string
  bookingInfo: string
  cancellationPolicy: string
  location: ServiceLocation
  isActive: boolean
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  futureDates: ServiceFutureDate[]
  termsAndCondition: string
  medias: ServiceMedia[]
  organizerId: string
  organizerName: string
  organizerImage: string
  organizerEmail: string
  organizerDescription: string
  organizerRating: number
  professionals: Professional[]
  reviews: any[]
  businessOtherServices: any[]
}

import type { Metadata } from 'next'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
import React from 'react'

import MonthlySalesChart from '@/components/ecommerce/MonthlySalesChart'
import StatisticsChart from '@/components/ecommerce/StatisticsChart'
import RecentOrders from '@/components/ecommerce/RecentOrders'

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />
      </div>
      {/* <div className="col-span-12 xl:col-span-7">
        <MonthlySalesChart />
        <div className="mt-6">
          <StatisticsChart />
        </div>
      </div>
      <div className="col-span-12 xl:col-span-5">
        <RecentOrders />
      </div> */}
    </div>
  )
}

import { SingleSidebarLayout } from '@/components/layouts/SingleSidebarLayout'
import KitchenContent from '@/app/(authenticated)/kitchen/KitchenContent'

export default function KitchenPage() {
  return (
    <SingleSidebarLayout>
      <KitchenContent />
    </SingleSidebarLayout>
  )
}

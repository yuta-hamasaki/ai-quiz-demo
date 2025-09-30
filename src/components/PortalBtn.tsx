"use client";
import { useRouter } from 'next/navigation'
export default function PortalBtn() {
    const router = useRouter()

  const loadPortal = async () =>{
    const url = process.env.NEXT_PUBLIC_URL
    const response = await fetch(`${url}/api/portal`)
    const data = await response.json()

    router.push(data.url)
  }
  return (
    <button onClick={loadPortal}>
      サブスクリプション管理
    </button>
  )
}

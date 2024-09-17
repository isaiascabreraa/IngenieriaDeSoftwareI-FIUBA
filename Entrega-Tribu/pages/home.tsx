import Image from "next/image"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <div className="flex h-full flex-col justify-center items-center colors_screen">
      <h1 className="text-9xl mb-5 font-bold text-blue-500">Praxis Systems Argentina</h1>
      <span className="text-7xl">Management system</span>
    </div>
  )
}

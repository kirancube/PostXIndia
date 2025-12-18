import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-red-700 to-yellow-500 text-white py-8">
      <div className="container">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 mb-4">
            <Link href="/" className="opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src="/postx-logo.jpeg"
                alt="PostX India"
                width={60}
                height={60}
                className="h-14 w-14 object-contain brightness-0 invert"
              />
            </Link>
            <Image
              src="/red-dragon-logo.jpeg"
              alt="Team RED-DRAGON"
              width={60}
              height={60}
              className="h-14 w-14 object-contain"
            />
          </div>
          <p className="text-base font-bold">Crafted by Team RED-DRAGON</p>
          <p className="text-sm">P R Kiran Kumar Reddy | K Sri Harsha Vardhan | Liel Stephen | C R Mohith Reddy</p>
          <p className="text-xs mt-3">Powering the Future of Indian Postal Services</p>
        </div>
      </div>
    </footer>
  )
}

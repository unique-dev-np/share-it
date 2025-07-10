import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Brand() {

    const path = usePathname()


    let addedStyle = ""

    if(path == "/dashboard") addedStyle = ""

  return (
    <Link href="/dashboard" className={cn(" px-7  flex items-center gap-4 justify-normal w-fit cursor-pointer py-2 hover:shadow-lg  hover:bg-accent duration-300" , addedStyle)} > 
    <img src="/shareit.png" alt="Logo" className="h-[50px] mix-blend-darken" />
    <p className="text-2xl text-primary font-bold" >Share IT</p>
    </Link>
  )
}

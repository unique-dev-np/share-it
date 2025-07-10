import { AlarmClockPlus, Ellipsis, EllipsisVertical, ImagePlus, Share2, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function BucketCardDropdownMenu() {
  return (
    <div className="hidden" >
    <DropdownMenu >
    <DropdownMenuTrigger > <Ellipsis className="h-[20px]" /></DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem> <AlarmClockPlus className="w-[18px] mr-2" /> Add Time</DropdownMenuItem>
      <DropdownMenuItem> <ImagePlus className="w-[18px] mr-2" />Upgrade</DropdownMenuItem>
      <DropdownMenuItem> <Trash className="w-[18px] mr-2" /> Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
    </div>
  )
}

"use client"

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import React from 'react'
import { toast } from 'react-toastify';

export default function HeaderShareButton({ bucketId }: { bucketId: string }) {


    function handleClick() {
        const shareableLink = `${window.location.origin}/b/${bucketId}`;
        navigator.clipboard.writeText(shareableLink);

        toast.success("A sharable link is copied.")
    }

    return (
        <Button onClick={handleClick} variant="outline" >
            <Share2 className='mr-2' /> Share
        </Button>
    )
}

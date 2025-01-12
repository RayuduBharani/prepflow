'use client'
import { Button } from "../ui/button"
import { Share2 } from "lucide-react"

export default function ShareButton() {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: document.title,
        url: window.location.href,
      })
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      className="rounded-full w-10 h-10"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}

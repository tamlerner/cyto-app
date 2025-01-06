import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const NewsletterCarousel = () => {
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 2500)

    return () => clearInterval(interval)
  }, [api])

  const newsItems = [
    {
      title: "Corporate Updates",
      description: "Reasons we look forward to 2025",
      link: "https://www.appcyto.com/en/news/2025-roadmap",
      imageUrl: "/placeholder1.png"
    },
    {
      title: "Industry Updates",
      description: "The Business Implications of President Biden's Recent Visit to Angola",
      link: "https://www.appcyto.com/en/news/joe-biden-angola",
      imageUrl: "/placeholder2.png"
    },
    {
      title: "Corporate Updates",
      description: "CYTO at WebSummit 2024",
      link: "https://www.appcyto.com/en/news/cyto-at-websummit-2024",
      imageUrl: "/placeholder3.png"
    },
    {
      title: "Industry Updates",
      description: "Donald Trump's Victory: Implications for Africa",
      link: "https://www.appcyto.com/en/news/us-election-trump-africa",
      imageUrl: "/placeholder4.png"
    },
  ]
  return (
    <div className="mt-1 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-normal mb-6 text-center text-gray-500">Our latest Insights & Articles</h2>
      <Carousel 
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {newsItems.map((item, index) => (
            <CarouselItem key={index}>
              <Card className="cursor-pointer" onClick={() => window.open(item.link, '_blank')}>
                <CardContent className="p-0">
                  <img 
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  )
}

export default NewsletterCarousel
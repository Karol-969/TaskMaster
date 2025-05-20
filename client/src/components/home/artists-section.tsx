import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateStarRating } from '@/lib/utils';

export function ArtistsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);

  const { data: artists = [], isLoading, error } = useQuery({
    queryKey: ['/api/artists'],
    queryFn: async () => {
      const res = await fetch('/api/artists');
      return res.json();
    }
  });

  useEffect(() => {
    const updateSlideWidth = () => {
      if (carouselRef.current) {
        const slideElement = carouselRef.current.querySelector('.carousel-item');
        if (slideElement) {
          setSlideWidth(slideElement.clientWidth);
        }
      }
    };

    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    return () => window.removeEventListener('resize', updateSlideWidth);
  }, []);

  const goToSlide = (index: number) => {
    if (index < 0) index = 0;
    if (index >= artists.length) index = artists.length - 1;
    setCurrentSlide(index);
  };

  return (
    <section id="artists" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Artists</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of exceptional talent available for your next event.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading artists...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load artists. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden animate-fade-in-up delay-100" ref={carouselRef}>
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentSlide * slideWidth}px)` }}
              >
                {artists.map((artist: any) => (
                  <div key={artist.id} className="carousel-item flex-shrink-0 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
                    <Card className="h-full overflow-hidden">
                      <div className="h-64 overflow-hidden">
                        <img 
                          src={artist.imageUrl} 
                          alt={`Artist - ${artist.name}`} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-xl font-bold">{artist.name}</h3>
                          <Badge variant="secondary">{artist.genre}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                          {artist.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex text-yellow-400">
                            {[...Array(generateStarRating(artist.rating).filled)].map((_, i) => (
                              <Star key={`filled-${i}`} className="h-4 w-4 fill-current" />
                            ))}
                            {generateStarRating(artist.rating).half && <StarHalf className="h-4 w-4 fill-current" />}
                            {[...Array(generateStarRating(artist.rating).empty)].map((_, i) => (
                              <Star key={`empty-${i}`} className="h-4 w-4" />
                            ))}
                          </div>
                          <Link href={`/artists/${artist.id}`}>
                            <a className="text-accent hover:underline">View Profile</a>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center mt-8 gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToSlide(currentSlide - 1)}
                disabled={currentSlide === 0}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToSlide(currentSlide + 1)}
                disabled={currentSlide >= artists.length - 1}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </Button>
            </div>

            <div className="text-center mt-10 animate-fade-in-up delay-200">
              <Link href="/artists">
                <Button variant="outline" className="group">
                  View All Artists
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

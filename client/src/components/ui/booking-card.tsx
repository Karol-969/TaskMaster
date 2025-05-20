import { ReactNode } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, generateStarRating } from '@/lib/utils';

interface BookingCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  badge?: string;
  rating?: number;
  icon?: ReactNode;
  subInfo?: ReactNode | string;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function BookingCard({
  title,
  description,
  imageUrl,
  price,
  badge,
  rating,
  icon,
  subInfo,
  label,
  onClick,
  disabled = false,
  className,
}: BookingCardProps) {
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg group", 
      disabled ? "opacity-60 pointer-events-none" : "hover:-translate-y-1",
      className
    )}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {label && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
            {label}
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold line-clamp-1">{title}</h3>
          {icon}
        </div>
        
        {badge && (
          <Badge className="mb-2" variant="secondary">
            {badge}
          </Badge>
        )}
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {truncateDescription(description)}
        </p>
        
        {rating !== undefined && (
          <div className="flex items-center mb-3 text-yellow-400">
            {[...Array(generateStarRating(rating).filled)].map((_, i) => (
              <Star key={`filled-${i}`} className="h-4 w-4 fill-current" />
            ))}
            {generateStarRating(rating).half && <StarHalf className="h-4 w-4 fill-current" />}
            {[...Array(generateStarRating(rating).empty)].map((_, i) => (
              <Star key={`empty-${i}`} className="h-4 w-4" />
            ))}
            <span className="ml-1 text-muted-foreground text-xs">({rating})</span>
          </div>
        )}
        
        {subInfo && (
          <div className="text-sm text-muted-foreground mb-3">
            {subInfo}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="font-semibold">{price}</div>
          <Button onClick={onClick} disabled={disabled}>Book Now</Button>
        </div>
      </CardContent>
    </Card>
  );
}

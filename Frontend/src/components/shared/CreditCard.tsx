import { MapPin, CheckCircle, Leaf, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarbonCredit } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface CreditCardProps {
  credit: CarbonCredit;
  onAddToCart?: (credit: CarbonCredit) => void;
  viewMode?: 'grid' | 'list';
}

export function CreditCard({ credit, onAddToCart, viewMode = 'grid' }: CreditCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all">
        <img 
          src={credit.image} 
          alt={credit.farmName}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{credit.farmName}</h3>
            {credit.verified && (
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{credit.location}, {credit.country}</span>
          </div>
          <Badge variant="secondary" className="mt-2 text-xs">
            {credit.practiceType}
          </Badge>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-primary">${credit.pricePerCredit}</p>
          <p className="text-sm text-muted-foreground">{credit.credits} credits</p>
        </div>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => onAddToCart?.(credit)}
          className="flex-shrink-0"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={credit.image} 
          alt={credit.farmName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={credit.verified ? "default" : "secondary"} className="backdrop-blur-sm">
            {credit.verified ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </>
            ) : (
              "Pending"
            )}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
            <Leaf className="w-3 h-3 mr-1 text-primary" />
            {credit.co2Offset} tons CO₂
          </Badge>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span>{credit.location}, {credit.country}</span>
        </div>
        
        <h3 className="font-semibold text-lg text-foreground mb-1">{credit.farmName}</h3>
        <p className="text-sm text-muted-foreground mb-3">{credit.farmerName}</p>
        
        <Badge variant="secondary" className="mb-4">
          {credit.practiceType}
        </Badge>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {credit.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-2xl font-bold text-primary">${credit.pricePerCredit}</p>
            <p className="text-xs text-muted-foreground">per credit • {credit.credits} available</p>
          </div>
          <Button variant="default" size="sm" onClick={() => onAddToCart?.(credit)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

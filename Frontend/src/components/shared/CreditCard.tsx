import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Leaf, MapPin, Calendar, User, ShoppingCart } from "lucide-react";

interface CreditCardProps {
  credit: {
    _id: string;
    totalCredits: number;
    pricePerCredit: number;
    totalValue: number;
    description: string;
    status: string;
    farmlandId: {
      landName: string;
      location: string;
      area: number;
      landImages?: string[];
      landType?: string;
      cultivationMethod?: string;
    };
    farmerId: {
      name: string;
      email: string;
    };
  };
  viewMode: 'grid' | 'list';
  onAddToCart: (credit: any) => void;
}

export const CreditCard = ({ credit, viewMode, onAddToCart }: CreditCardProps) => {
  const imageUrl = credit.farmlandId.landImages?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';

  if (viewMode === 'list') {
    return (
      <Card className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden">
            <img
              src={imageUrl}
              alt={credit.farmlandId.landName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {credit.farmlandId.landName}
                  </h3>
                  <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                    {credit.farmlandId.landType || 'Farmland'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{credit.farmlandId.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{credit.farmerId.name}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{credit.totalValue.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-muted-foreground">
                  ₹{credit.pricePerCredit}/credit
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {credit.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-foreground">{credit.totalCredits}</span>
                  <span>Credits</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{credit.farmlandId.area} acres</span>
                </div>
              </div>
              <Button
                onClick={() => onAddToCart(credit)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="group border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl overflow-hidden">
      {/* Image Section */}
      <div className="relative h-60 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={credit.farmlandId.landName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-emerald-500 text-emerald-600">
            {credit.farmlandId.landType || 'Farmland'}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-emerald-600/90 backdrop-blur-sm">
            {credit.totalCredits} Credits
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
            {credit.farmlandId.landName}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{credit.farmlandId.location}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{credit.farmerId.name}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
          {credit.description}
        </p>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{credit.farmlandId.area} acres</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-foreground">{credit.farmlandId.cultivationMethod || 'Sustainable'}</span>
          </div>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Value</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹{credit.totalValue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Per Credit</p>
            <p className="text-lg font-semibold text-foreground">
              ₹{credit.pricePerCredit}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => onAddToCart(credit)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 group-hover:shadow-lg transition-all"
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

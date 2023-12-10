interface Extent {
  lat1: number;
  long1: number;
  lat2: number;
  long2: number;
}

interface Coordinate {
  lat: number;
  long: number;
}

interface RouteRecommendation {}

interface MultilineText {}

interface LorryParkingFeatureIcon {
  icon: string;
  description: string;
  style: string;
}

interface Roadwork {
  extent: Extent;
  identifier: string;
  routeRecommendation: RouteRecommendation[];
  coordinate: Coordinate;
  footer: MultilineText[];
  icon: string;
  isBlocked: string;
  description: MultilineText[];
  title: string;
  point: string;
  displayType: string;
  lorryParkingFeatureIcons: LorryParkingFeatureIcon[];
  future: boolean;
  subtitle: string;
  startTimestamp: string;
}

interface Roadworks {
  roadworks: Roadwork[];
}

export default Roadworks;

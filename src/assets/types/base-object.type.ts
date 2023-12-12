interface BaseObject {
  extent: string;
  identifier: string;
  routeRecommendation: RouteRecommendation[];
  coordinate: Coordinate;
  footer: MultilineText;
  icon: string;
  isBlocked: string;
  description: MultilineText;
  title: string;
  point: string;
  display_type: string;
  lorryParkingFeatureIcons: LorryParkingFeatureIcon[];
  future: boolean;
  subtitle: string;
  startTimestamp: string;
}

interface Coordinate {
  lat: string; // Can be number if parsed
  long: string; // Can be number if parsed
}

interface RouteRecommendation {}

type MultilineText = string[];

interface LorryParkingFeatureIcon {
  icon: string;
  description: string;
  style: string;
}

export default BaseObject;

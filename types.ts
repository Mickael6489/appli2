export enum UnitSystem {
  Metric = 'metric',
  Imperial = 'imperial',
}

export enum RockType {
  VerySoft = 'verysoft',
  Soft = 'soft',
  Medium = 'medium',
  Hard = 'hard',
}

export enum BlastPattern {
  Staggered = 'Staggered',
  Square = 'Square',
  Diagonal = 'Diagonal',
}

export interface BlastInputs {
  diameter: number;
  depth: number;
  benchLength: number;
  benchWidth: number;
  explosiveDensity: number;
  rockDensity: number;
  stemmingFactor: number;
  burdenFactor: number;
  rockType: RockType;
  pattern: BlastPattern;
  // Geolocation
  latitude: number;
  longitude: number;
  azimuth: number; // Degrees (0-360)
}

export interface CalculationResults {
  B: number; // Burden
  S: number; // Spacing
  st: number; // Stemming
  Q_per_hole: number; // Charge per hole
  rows: number;
  cols: number;
  num_holes: number;
  total_explosive: number;
  PF: number; // Powder Factor
  KR: number; // Stiffness Ratio
}

export interface QualityAssessment {
  fragmentation: string;
  airBlast: string;
  flyRock: string;
  groundVibration: string;
  comment: string;
  action: string;
}

export interface GeoHole {
  id: string;
  lat: number;
  lng: number;
  row: number;
  col: number;
}
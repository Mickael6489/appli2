import { BlastInputs, CalculationResults, QualityAssessment, UnitSystem, RockType, BlastPattern, GeoHole } from '../types';

// Constants
const ksMap: Record<BlastPattern, number> = { 
  [BlastPattern.Square]: 1.0, 
  [BlastPattern.Staggered]: 1.146, 
  [BlastPattern.Diagonal]: 1.3 
};

const rockRanges: Record<RockType, { kb: [number, number]; kst: [number, number] }> = {
  [RockType.VerySoft]: { kb: [18, 25], kst: [0.6, 0.8] },
  [RockType.Soft]: { kb: [25, 30], kst: [0.6, 0.8] },
  [RockType.Medium]: { kb: [30, 35], kst: [0.7, 0.8] },
  [RockType.Hard]: { kb: [35, 45], kst: [0.7, 0.9] },
};

// Unit Conversions
export const ftToM = (x: number) => x / 3.28084;
export const mToFt = (x: number) => x * 3.28084;
export const lbToKg = (x: number) => x / 2.2046226218;
export const kgToLb = (x: number) => x * 2.2046226218;
export const lbft3ToKgm3 = (x: number) => x * 16.01846337396;
export const kgm3Tolbft3 = (x: number) => x / 16.01846337396;

// Main Calculation
export const calculateBlastDesign = (inputs: BlastInputs, unitSystem: UnitSystem): CalculationResults => {
  let { diameter, depth, benchLength: bl, benchWidth: bw, explosiveDensity: expd, rockDensity: density } = inputs;
  const { stemmingFactor: kst, burdenFactor: kb, pattern } = inputs;

  // Convert to metric for internal calculation if Imperial
  if (unitSystem === UnitSystem.Imperial) {
    diameter = ftToM(diameter);
    depth = ftToM(depth);
    bl = ftToM(bl);
    bw = ftToM(bw);
    expd = lbft3ToKgm3(expd);
    density = lbft3ToKgm3(density);
  }

  const Ks = ksMap[pattern];
  const B = kb * diameter;
  const S = Ks * B;
  const st = kst * B;
  const exp_length = depth - st;
  const cs_area = Math.PI * (diameter ** 2) / 4;
  const Q_per_hole = exp_length * cs_area * expd;
  
  const rows = Math.ceil(bw / B);
  const cols = Math.ceil(bl / S);
  const num_holes = rows * cols;
  
  const rock_volume_per_hole = B * S * depth;
  const rock_mass_per_hole = rock_volume_per_hole * density;
  
  const total_explosive = Q_per_hole * num_holes;
  const total_rock_mass = rock_mass_per_hole * num_holes;
  
  const PF = total_explosive / (total_rock_mass / 1000); 
  
  const H = depth;
  const KR = Math.ceil(H / B);

  return {
    B, S, st, Q_per_hole, rows, cols, num_holes, total_explosive, PF, KR
  };
};

// --- GEOSPATIAL CALCULATIONS ---

/**
 * Generates local grid coordinates (x, y in meters) for all holes
 * X is along the bench length (Spacing direction)
 * Y is along the bench width (Burden direction)
 */
export const generateHoleGrid = (
  results: CalculationResults, 
  pattern: BlastPattern
): { x: number; y: number; row: number; col: number }[] => {
  const holes = [];
  const { rows, cols, B, S } = results;

  for (let r = 0; r < rows; r++) {
    const isStaggered = pattern === BlastPattern.Staggered || pattern === BlastPattern.Diagonal;
    const x_offset = (isStaggered && r % 2 !== 0) ? S / 2 : 0;
    
    for (let c = 0; c < cols; c++) {
      const x = (c * S) + x_offset;
      const y = r * B;
      holes.push({ x, y, row: r, col: c });
    }
  }
  return holes;
};

/**
 * Projects local grid (x,y) to Real World (Lat, Lng)
 * Origin: Starting Lat/Lng
 * Azimuth: Direction of the Bench Length (X-axis) in degrees (0 = North, 90 = East)
 */
export const projectCoordinates = (
  originLat: number, 
  originLng: number, 
  azimuthDeg: number, 
  holes: { x: number; y: number; row: number; col: number }[]
): GeoHole[] => {
  const R = 6378137; // Earth Radius (m)
  const rad = Math.PI / 180;
  const bearingRad = azimuthDeg * rad;

  return holes.map((h, i) => {
    // We treat X as distance along azimuth
    // We treat Y as distance perpendicular to azimuth (Azimuth + 90 deg)
    // d = distance from origin
    // theta = angle from origin relative to Azimuth
    
    const d = Math.sqrt(h.x * h.x + h.y * h.y);
    const angleFromAxis = Math.atan2(h.y, h.x); // Angle relative to bench axis (X)
    
    // Total bearing from North = Bench Azimuth + Angle from Bench Axis + 90 deg? 
    // Wait, in Map Logic: 0 is North. 90 is East.
    // If Azimuth is 90 (East), and Hole is at X=10, Y=0. It is East.
    // If Hole is at X=0, Y=10. Y is Burden. Usually Burden is perpendicular to Length.
    // So Y is at Azimuth + 90 degrees.
    
    // Standard polar math: 0 is X axis.
    // We rotate (x,y) by (Azimuth - 90)? No, let's keep it simple.
    
    // Global Bearing = Azimuth + Math.atan2(y, x). (But Math.atan2 is counter-clockwise from X usually... geospatial is clockwise from North).
    // Let's use standard rotation.
    // X axis aligns with Azimuth.
    // Y axis aligns with Azimuth + 90.
    
    // North Component = x * cos(bearing) + y * cos(bearing + 90)
    // East Component  = x * sin(bearing) + y * sin(bearing + 90)
    
    const dNorth = h.x * Math.cos(bearingRad) + h.y * Math.cos(bearingRad + Math.PI/2);
    const dEast  = h.x * Math.sin(bearingRad) + h.y * Math.sin(bearingRad + Math.PI/2);
    
    // Simple equirectangular approximation for small distances (mining benches are small vs Earth)
    // dLat = dNorth / R
    // dLon = dEast / (R * cos(lat))
    
    const dLat = (dNorth / R) / rad;
    const dLon = (dEast / (R * Math.cos(originLat * rad))) / rad;
    
    return {
      id: `h-${i}`,
      lat: originLat + dLat,
      lng: originLng + dLon,
      row: h.row,
      col: h.col
    };
  });
};


export const getQualityAssessment = (KR: number): QualityAssessment => {
  let values: string[] = [];
  if (KR <= 1) values = ["Poor", "Severe", "Severe", "Severe", "Severe back break/toe problems", "Do not blast"];
  else if (KR === 2) values = ["Fair", "Fair", "Fair", "Fair", "Fair control", "Redesign if possible"];
  else if (KR === 3) values = ["Good", "Good", "Good", "Good", "Good control and fragmentation", "None required"];
  else values = ["Excellent", "Excellent", "Excellent", "Excellent", "No increased benefits", "Consider reducing KR"];

  return {
    fragmentation: values[0],
    airBlast: values[1],
    flyRock: values[2],
    groundVibration: values[3],
    comment: values[4],
    action: values[5],
  };
};

export const getWarnings = (inputs: BlastInputs, Q_per_hole: number): string[] => {
  const messages: string[] = [];
  const rockRange = rockRanges[inputs.rockType];
  
  if (inputs.burdenFactor < rockRange.kb[0] || inputs.burdenFactor > rockRange.kb[1]) {
    messages.push(`Burden factor (B) out of recommended range ${rockRange.kb[0]}–${rockRange.kb[1]}.`);
  }
  if (inputs.stemmingFactor < rockRange.kst[0] || inputs.stemmingFactor > rockRange.kst[1]) {
    messages.push(`Stemming factor (st) out of recommended range ${rockRange.kst[0]}–${rockRange.kst[1]}.`);
  }
  if (Q_per_hole < 0.5 || Q_per_hole > 2000) {
    messages.push(`Charge per hole (${Q_per_hole.toFixed(1)} kg) seems unusual. Check inputs.`);
  }
  
  return messages;
};

export const convertInputs = (inputs: BlastInputs, toUnit: UnitSystem): BlastInputs => {
  const isToImperial = toUnit === UnitSystem.Imperial;
  const convertLen = isToImperial ? mToFt : ftToM;
  const convertDens = isToImperial ? kgm3Tolbft3 : lbft3ToKgm3;
  const r = (n: number) => parseFloat(n.toFixed(3));

  return {
    ...inputs,
    diameter: r(convertLen(inputs.diameter)),
    depth: r(convertLen(inputs.depth)),
    benchLength: r(convertLen(inputs.benchLength)),
    benchWidth: r(convertLen(inputs.benchWidth)),
    explosiveDensity: r(convertDens(inputs.explosiveDensity)),
    rockDensity: r(convertDens(inputs.rockDensity)),
  };
};
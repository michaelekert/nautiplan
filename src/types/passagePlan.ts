export interface Segment {
  id: string;
  startName: string;
  endName: string;
  autoStartName: string;
  autoEndName: string;
  distanceNm: number;
  speed: number;
  stopHours: number;
  timeHours: number;
  arrivalTime: Date;
}

export interface MapDrawHandlers {
  enforceSingleLine: (e: any) => void;
  updateSegments: () => Promise<void>;
}
export interface BeaufortScale {
  force: number
  description: string
  windKt: string
  windMph: number
  windKmh: number
  wavesM: number
  wavesFt: number
}

export interface DouglasScale {
  degree: number
  description: string
  heightM: string
  heightFt: string
  characteristics: string
}

export interface CloudType {
  name: string
  latinName: string
  altitude: string
  description: string
  weather: string
}

export interface WeatherFront {
  type: string
  symbol: string
  description: string
  characteristics: string[]
  weather: string
}

export type SpeedUnit = "kt" | "mph" | "kmh"
export type HeightUnit = "m" | "ft"
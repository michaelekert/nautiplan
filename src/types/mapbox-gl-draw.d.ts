declare module "@mapbox/mapbox-gl-draw" {
  import type { IControl, Map } from "mapbox-gl";

  export interface MapboxDrawOptions {
    displayControlsDefault?: boolean;
    controls?: {
      point?: boolean;
      line_string?: boolean;
      polygon?: boolean;
      trash?: boolean;
      combine_features?: boolean;
      uncombine_features?: boolean;
    };
    styles?: any[];
  }

  export default class MapboxDraw implements IControl {
    add(arg0: { type: string; properties: {}; geometry: { type: string; coordinates: [number, number][]; }; }) {
      throw new Error("Method not implemented.");
    }
    delete(id: string | number | undefined) {
      throw new Error("Method not implemented.");
    }
    constructor(options?: MapboxDrawOptions);
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
    getAll(): GeoJSON.FeatureCollection;
    deleteAll(): void;
    set(data: GeoJSON.FeatureCollection): void;
  }
}


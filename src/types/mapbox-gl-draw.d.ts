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
    constructor(options?: MapboxDrawOptions);
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
    getAll(): GeoJSON.FeatureCollection;
    deleteAll(): void;
    set(data: GeoJSON.FeatureCollection): void;
  }
}


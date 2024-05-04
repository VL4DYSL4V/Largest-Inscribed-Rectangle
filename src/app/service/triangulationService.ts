import {Point, Polygon} from "../types/math";
import Delaunator from 'delaunator';

const flattenPointsForDelaunator = (points: Array<Point>): Array<number> => {
    return points.flat();
}

export const triangulate = ({
    polygon,
}: {
    polygon: Polygon,
}): Array<Point[]> => {
    const flatPolygon = flattenPointsForDelaunator(polygon);
    const delaunay = new Delaunator(flatPolygon);
    const triangles = delaunay.triangles || [];

    const triangulationCoordinates = [];
    for (let i = 0; i < triangles.length; i += 3) {
        triangulationCoordinates.push([
            polygon[triangles[i]],
            polygon[triangles[i + 1]],
            polygon[triangles[i + 2]]
        ]);
    }

    return triangulationCoordinates;
}

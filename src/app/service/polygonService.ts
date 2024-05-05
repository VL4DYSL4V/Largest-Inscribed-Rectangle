import {getRandomInt, getRandomNumbersInInterval} from "../utils/randomUtils";
import {PolygonBounds} from "../types/polygonTypes";
import * as geometric from 'geometric';
import {Line} from 'geometric';
import {Point, Polygon} from "../types/math";
import {before, result} from "lodash";

const toRadians = (angle: number): number => {
    return angle * (Math.PI / 180);
}

const generatePolygon = ({center, sides, maxRadius, centerPadding}: {
    center: [number, number],
    sides: number,
    centerPadding: number,
    maxRadius: number,
}): Polygon => {
    const polygon: Array<[number, number]> = [];

    const angles = getRandomNumbersInInterval({
        interval: [0, 360],
        amount: sides,
    });

    for (const angle of angles) {
        const angleAsRadian = toRadians(angle);
        const radius = getRandomInt(centerPadding, maxRadius);

        const x = radius * Math.cos(angleAsRadian);
        const y = radius * Math.sin(angleAsRadian);

        const point: [number, number] = [Math.ceil(x) + center[0], Math.ceil(y) + center[1]];
        polygon.push(point);
    }

    return polygon;
}

export const getRandomPolygon = ({
                                     sides,
                                     centerPadding,
                                     maxRadius,
                                     center,
                                 }: {
    sides: number,
    centerPadding: number,
    maxRadius: number,
    center: [number, number]
}): Polygon => {
    return generatePolygon({
        center,
        sides,
        maxRadius,
        centerPadding
    });
}

export const getPolygonBounds = ({
                                     polygon
                                 }: {
    polygon: Array<[number, number]>
}): PolygonBounds => {
    let minX = Infinity;
    let maxX = 0;
    let minY = Infinity;
    let maxY = 0;

    for (const point of polygon) {
        const x = point[0];
        const y = point[1];
        if (x > maxX) {
            maxX = x;
        }
        if (x < minX) {
            minX = x;
        }
        if (y > maxY) {
            maxY = y;
        }
        if (y < minY) {
            minY = y;
        }
    }

    return {
        topLeft: [minX, minY],
        topRight: [maxX, minY],
        bottomLeft: [minX, maxY],
        bottomRight: [maxX, maxY],
    };
}

export const getPolygonHull = ({
                                   polygon
                               }: {
    polygon: Polygon
}): Polygon => {
    return geometric.polygonHull(polygon);
}

export const getInnerTriangulation = ({
                                          polygon,
                                          convexTriangulation,
                                          scaleFactor = 0.999,
                                      }: {
    polygon: Polygon,
    convexTriangulation: Array<Point[]>,
    scaleFactor?: number
}): Array<Point[]> => {
    return convexTriangulation.filter((points) => {
        const scaledTriangle = geometric.polygonScale(points, scaleFactor);
        return geometric.polygonInPolygon(scaledTriangle, polygon);
    })
}

const getPolygonWithBiggestArea = ({
                                       polygons
                                   }: {
    polygons: Array<Polygon>
}): Polygon | undefined => {
    let previousLargestPolygon = undefined;
    let previousLargestPolygonArea = 0;

    for (const polygon of polygons) {
        const area = geometric.polygonArea(polygon);
        if (area > previousLargestPolygonArea) {
            previousLargestPolygonArea = area;
            previousLargestPolygon = polygon;
        }
    }

    return previousLargestPolygon;
}

const arePointsEqual = ({
                            point1,
                            point2,
                        }: {
    point1: Point,
    point2: Point,
}): boolean => {
    if (point1.length !== point2.length) {
        return false;
    }

    for (let j = 0; j < point1.length; j++) {
        if (point1[j] !== point2[j]) {
            return false;
        }
    }
    return true;
}

const arePolygonsEqual = ({
                              polygon1,
                              polygon2
                          }: {
    polygon1: Polygon,
    polygon2: Polygon,
}): boolean => {
    if (polygon1.length !== polygon2.length) {
        return false;
    }
    for (let i = 0; i < polygon1.length; i++) {
        const point1 = polygon1[i];
        const point2 = polygon2[i];

        if (!arePointsEqual({point1, point2})) {
            return false;
        }

    }
    return true;
}

const getAdjacentTrianglesWithoutPointsInside = ({
                                                     triangulationGroup,
                                                     triangulationRemainder,
                                                 }: {
    triangulationGroup: Array<Polygon>,
    triangulationRemainder: Array<Polygon>,
}): Array<Polygon> => {
    const result: Array<Polygon> = [];

    for (const remainingTriangle of triangulationRemainder) {
        for (const triangulationGroupElement of triangulationGroup) {
            const pointsToCheckIfInsideTriangleGroupElement: Array<Point | undefined> = [...remainingTriangle];
            const commonPoints = [];

            for (let i = 0; i < remainingTriangle.length; i++) {
                const remainingTrianglePoint = remainingTriangle[i];
                for (const triangulationGroupElementPoint of triangulationGroupElement) {
                    if (arePointsEqual({point1: remainingTrianglePoint, point2: triangulationGroupElementPoint})) {
                        commonPoints.push(remainingTrianglePoint);
                        pointsToCheckIfInsideTriangleGroupElement[i] = undefined;
                    }
                }
            }

            if (commonPoints.length === 2) {
                const pointToCheck = pointsToCheckIfInsideTriangleGroupElement.find(Boolean);
                if (pointToCheck && !geometric.pointInPolygon(pointToCheck, triangulationGroupElement)) {
                    result.push(remainingTriangle);
                }
            }
        }
    }

    return result;
};

export const getTriangulationPiecesOfBiggestAreaWithNoPointsInside = ({
                                                                          triangulation,
                                                                      }: {
    triangulation: Array<Point[]>
}): Array<Point[]> => {
    const result: Array<Point[]> = [];

    const largestTriangle = getPolygonWithBiggestArea({polygons: triangulation});
    if (!largestTriangle) {
        return result;
    }
    result.push(largestTriangle);

    let triangulationRemainder = triangulation.filter(t => !arePolygonsEqual({polygon1: t, polygon2: largestTriangle}));
    while (true) {
        const adjacentTriangles = getAdjacentTrianglesWithoutPointsInside({
            triangulationGroup: result,
            triangulationRemainder: triangulationRemainder,
        });
        if (!adjacentTriangles.length) {
            break;
        }
        result.push(...adjacentTriangles);

        for (const adjacentTriangle of adjacentTriangles) {
            triangulationRemainder = triangulationRemainder.filter(t => !arePolygonsEqual({
                polygon1: t,
                polygon2: adjacentTriangle
            }));
        }
    }

    return result;
}

export const flattenInnerTriangulation = ({
                                         triangulation,
                                         originalFigure,
                                     }: {
    triangulation: Array<Point[]>,
    originalFigure: Polygon
}): Polygon => {
    // TODO: Iterate over all points of the original. If there is a triangle with such point - add it to the result
    const points: Array<Point> = [];

    for (const point of originalFigure) {
        const triangleWithSuchPoint = triangulation.find(triangle => triangle.find(trianglePoint => arePointsEqual({
            point1: trianglePoint,
            point2: point,
        })));
        if (triangleWithSuchPoint) {
            points.push(point)
        }
    }

    return points;
}

const constructPolygonFromPoints = ({
    originalPolygon,
    points
}: {
    originalPolygon: Polygon,
    points: Array<Point>,
}): Polygon => {
    const res: Polygon = [];
    for (const op of originalPolygon) {
        for (const p of points) {
            if (arePointsEqual({ point1: op, point2: p })) {
                res.push(op);
            }
        }
    }

    return res;
}

export const getInnerConvexHull = ({polygon}: {
    polygon: Polygon,
}): Polygon => {
    const centroid = geometric.polygonCentroid(polygon);
    const polygonPointsSortedByCloseness = [...polygon]
        .sort((p1, p2) => {
            const line1 = [centroid, p1];
            const line2 = [centroid, p2];
            const length1 = geometric.lineLength(line1 as Line);
            const length2 = geometric.lineLength(line2 as Line);
            return length1 > length2 ? 1 : -1;
        });

    const top3Points = polygonPointsSortedByCloseness.slice(0, 3)
        .sort((p1, p2) => {
            const line1 = [centroid, p1];
            const line2 = [centroid, p2];
            const angle1 = geometric.lineAngle(line1 as Line);
            const angle2 = geometric.lineAngle(line2 as Line);
            return angle1 > angle2 ? 1 : -1;
        })
    let innerConvexHull = geometric.polygonHull(top3Points);

    for (let i = 3; i < polygonPointsSortedByCloseness.length; i++) {
        const point = polygonPointsSortedByCloseness[i];
        const topPointsToTest = [...innerConvexHull, point];
        const innerPolygon = constructPolygonFromPoints({
            originalPolygon: polygon,
            points: topPointsToTest,
        });

        let isConvexHullPoint = true;
        const convexHull = geometric.polygonHull(innerPolygon);

        for (const ip of innerPolygon) {
            const pointOnHull = convexHull.find(hp => arePointsEqual({ point1: ip, point2: hp}));
            if (!pointOnHull) {
                isConvexHullPoint = false;
            }
        }
        if (isConvexHullPoint) {
            innerConvexHull = convexHull;
        }
    }

    return innerConvexHull;
}

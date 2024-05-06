import {getRandomInt, getRandomNumbersInInterval} from "../utils/randomUtils";
import {PolygonBounds} from "../types/polygonTypes";
import * as geometric from 'geometric';
import {Line} from 'geometric';
import {Point, Polygon} from "../types/math";

const generatePolygon = ({center, sides, maxRadius, centerPadding}: {
    center: [number, number],
    sides: number,
    centerPadding: number,
    maxRadius: number,
}): Polygon => {
    const polygon: Array<[number, number]> = [];

    const angles = getRandomNumbersInInterval({
        interval: [90, 360 + 90],
        amount: sides,
    });

    for (const angle of angles) {
        const angleAsRadian = geometric.angleToRadians(angle);
        const radius = getRandomInt(centerPadding, maxRadius);

        const x = Math.ceil(radius * Math.cos(angleAsRadian));
        const y = Math.ceil(radius * Math.sin(angleAsRadian));

        const point: [number, number] = [
            Number(Number(x + center[0]).toFixed(0)),
            Number(Number(y + center[1]).toFixed(0)),
        ];
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
            if (arePointsEqual({point1: op, point2: p})) {
                res.push(op);
            }
        }
    }

    return res;
}

const sortPointsByCloseness = ({points, center}: { points: Array<Point>, center: Point }): Array<Point> => {
    return [...points].sort((p1, p2) => {
        const line1 = [center, p1];
        const line2 = [center, p2];
        const length1 = geometric.lineLength(line1 as Line);
        const length2 = geometric.lineLength(line2 as Line);
        return length1 > length2 ? 1 : -1;
    });
}

const sortPointsByAngle = ({points, center}: { points: Array<Point>, center: Point }): Array<Point> => {
    return [...points].sort((p1, p2) => {
        const line1 = [center, p1];
        const line2 = [center, p2];
        let angle1 = geometric.angleToDegrees(geometric.lineAngle(line1 as Line));
        let angle2 = geometric.angleToDegrees(geometric.lineAngle(line2 as Line));

        if (angle1 < 90) {
            angle1 += 90;
        }
        if (angle2 < 90) {
            angle2 += 90;
        }

        return angle1 > angle2 ? 1 : -1;
    });
}

export const getInnerConvexHull = ({polygon}: {
    polygon: Polygon,
}): Polygon => {
    const centroid = geometric.polygonCentroid(polygon);
    const polygonPointsSortedByCloseness = sortPointsByCloseness({
        points: polygon,
        center: centroid,
    });
    const top3Points = polygonPointsSortedByCloseness.slice(0, 3);
    const initialHull = sortPointsByAngle({
        points: top3Points,
        center: centroid,
    });
    let innerConvexHull = geometric.polygonHull(initialHull);

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
            const pointOnHull = convexHull.find(hp => arePointsEqual({point1: ip, point2: hp}));
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

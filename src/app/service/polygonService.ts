import {getRandomInt, getRandomNumbersInInterval} from "../utils/randomUtils";
import {PolygonBounds} from "../types/polygonTypes";
import * as geometric from 'geometric';
import {Point, Polygon} from "../types/math";

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

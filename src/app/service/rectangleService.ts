/* eslint-disable no-undef, no-unused-vars */
import * as geometric from 'geometric';
import {Polygon} from "../types/math";
import {Point2D} from "../dto/point2D";


const NRPOINTS = 10;
const EPSILON = 0.1;
const FIRST = 1;
const BACK = -1;

let SW: Point2D[] = [];
let SE: Point2D[] = [];
let NE: Point2D[] = [];
let NW: Point2D[] = [];

let possibleDirections: Array<[Point2D, Point2D]> = [];

function resetpoints() {
    SW = [];
    SE = [];
    NE = [];
    NW = [];

    possibleDirections = [];
}

const getPolygonExtremesIndexes = (listOfPoints: Point2D[]): {
    maxY: number,
    minY: number,
    maxX: number,
    minX: number,
} => {
    let maxY = 0;
    let minY = 0;
    let maxX = 0;
    let minX = 0;

    for (let p = 0; p < listOfPoints.length; p++) {
        if (listOfPoints[p].x > listOfPoints[maxX].x) {
            maxX = p;
        } else if (listOfPoints[p].x < listOfPoints[minX].x) {
            minX = p;
        }
        if (listOfPoints[p].y > listOfPoints[maxY].y) {
            maxY = p;
        } else if (listOfPoints[p].y < listOfPoints[minY].y) {
            minY = p;
        }
    }
    return {
        minX,
        maxX,
        minY,
        maxY,
    } //CAUTION : those are the indexes
}

/*FINDING DIRECTIONS*/
const computePossibleDirections = ({points}: { points: Array<Point2D> }) => {
    const U = generateRandomPointsInside({amount: NRPOINTS, polygon: points})
    const V = generateRandomPointsInside({amount: NRPOINTS / EPSILON, polygon: points});
    for (let u = 0; u < U.length; u++) {
        for (let v = 0; v < V.length; v++) {
            possibleDirections.push([U[u], V[v]]);
        }
    }
}

const generateRandomPointsInside = ({amount, polygon}: { amount: number, polygon: Array<Point2D> }): Array<Point2D> => {
    const pointsList: Point2D[] = [];
    const {minX, maxX, minY, maxY} = getPolygonExtremesIndexes(polygon);
    while (pointsList.length < amount) {
        pointsList.push(
            generateOneInsidePoint({
                minX,
                maxX,
                minY,
                maxY,
                polygon,
            })
        );
    }
    return pointsList;
}

const generateOneInsidePoint = ({
                                    polygon,
                                    maxY,
                                    minX,
                                    minY,
                                    maxX,
                                }: {
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    polygon: Array<Point2D>
}): Point2D => {
    const geometricPolygon = polygon.map(p => [p.x, p.y]);

    const y = Math.random() * (polygon[maxY].y - polygon[minY].y) + polygon[minY].y;
    const x = Math.random() * (polygon[maxX].x - polygon[minX].x) + polygon[minX].x;
    const newPoint = new Point2D(x, y);
    while (!geometric.pointInPolygon([newPoint.x, newPoint.y], geometricPolygon as Polygon)) {
        newPoint.x = Math.random() * (polygon[maxX].x - polygon[minX].x) + polygon[minX].x;
    }
    return newPoint;
}

/*ROTATION*/

const rotatePoints = (u: Point2D, v: Point2D, backForth: number, polygon: Array<Point2D>, vertices: Array<Point2D>) => {
    //if backForth = 1, normal. if =-1, back rotation
    const theta = Math.atan((v.y - u.y) / (v.x - u.x));
    const {minX, maxX, minY, maxY} = getPolygonExtremesIndexes(vertices);
    const tx = (vertices[minX].x + vertices[maxX].x) / 2;
    const ty = (vertices[minY].y + vertices[maxY].y) / 2;
    actualRotation(tx, ty, theta, backForth, polygon);
}

const actualRotation = (tx: number, ty: number, theta: number, backForth: number, pointsToRotate: Array<Point2D>) => {
    for (const p in pointsToRotate) {
        const oldX = pointsToRotate[p].x;
        const oldY = pointsToRotate[p].y;
        pointsToRotate[p].x =
            (oldX - tx) * Math.cos(backForth * theta) +
            (oldY - ty) * Math.sin(backForth * theta) +
            tx;
        pointsToRotate[p].y =
            -(oldX - tx) * Math.sin(backForth * theta) +
            (oldY - ty) * Math.cos(backForth * theta) +
            ty;
    }
}

/*FINDING LARGEST RECTANGLE*/
const int = (a: any): number => {
    return Math.floor(Number(a));
}

const BS_region = (f: (index: number, val: number, region: Point2D[]) => boolean, val: number, region: Point2D[]): number => {
    let i;
    let u = region.length;
    let l = 0;
    let flag = true;
    if (u === 2) {
        return 0;
    }
    while (flag) {
        i = int((l + u) / 2);
        if (i === region.length - 1) {
            return i;
        }
        if (!f(i, val, region)) {
            u = i;
        } else if (f(i + 1, val, region)) {
            l = i;
        } else {
            return i;
        }
        if (l === u) {
            return i;
        }
    }
    throw new Error('Could not find region')
}

/* Function used to do binary search on
regions (SW, SE, NW, NE) of the polygon*/

const x_south = (i: number, val: number, region: Point2D[]): boolean => {
    return region[i].x < val;
}
const x_north = (i: number, val: number, region: Point2D[]): boolean => {
    return region[i].x > val;
}
const y_west = (i: number, val: number, region: Point2D[]): boolean => {
    return region[i].y < val;
}
const y_east = (i: number, val: number, region: Point2D[]): boolean => {
    return region[i].y > val;
}

/* Binary Search to find the x that give max area */
const BS_xMaxArea = (f: (index: number, regName: string) => number, region: Point2D[], reg_name: string, x_min: number, x_max: number): number => {
    let i = 0;
    let u = x_max;
    let l = x_min;
    let flag = true;
    let counter = 0;
    while (flag && counter < 100) {
        counter = counter + 1;
        i = int((l + u) / 2);
        //console.log("BS_xMA-i & reg_name", i, " ", reg_name);
        const area1 = f(i, reg_name);
        const area2 = f(i + 1, reg_name);
        //console.log("BS-XMA-area1 :", area1);
        //console.log("BS-XMA-area2 :", area2);
        if (int(area1) > int(area2)) {
            u = i;
        } else if (int(area1) < int(area2)) {
            l = i;
        } else {
            return i;
        }
        if (l === u || l + 1 === u) {
            return i;
        }
    }
    return i;
}

/** Find the largest area rectangle // to axes*/
const searchLargestRectangle = ({points}: { points: Array<Point2D> }) => {
    const {minX, maxX, minY, maxY} = getPolygonExtremesIndexes(points);

    const l_points = points.length;

    //SW
    SW = [];
    if (minX < maxY) {
        SW = points.slice(minX, maxY);
    } else if (minX > maxY) {
        SW = points.slice(minX);
        SW = SW.concat(points.slice(0, maxY));
    }
    SW.push(points[maxY % l_points]);

    //SE
    SE = [];
    if (maxY < maxX) {
        SE = points.slice(maxY, maxX);
    } else if (maxY > maxX) {
        SE = points.slice(maxY);
        SE = SE.concat(points.slice(0, maxX));
    }
    SE.push(points[maxX % l_points]);

    //NE
    NE = [];
    if (maxX < minY) {
        NE = points.slice(maxX, minY);
    } else if (maxX > minY) {
        NE = points.slice(maxX);
        NE = NE.concat(points.slice(0, minY));
    }
    NE.push(points[minY % l_points]);

    //NW
    NW = [];
    if (minY < minX) {
        NW = points.slice(minY, minX);
    } else if (minY > minX) {
        NW = points.slice(minY);
        NW = NW.concat(points.slice(0, minX));
    }
    NW.push(points[minX % l_points]);

    const x_min_w = SW[0].x;
    const x_max_w = Math.min(SW[SW.length - 1].x, NW[0].x);
    const x_min_e = Math.max(NE[NE.length - 1].x, SE[0].x);
    const x_max_e = NE[0].x;

    let sol_w = undefined;
    let west_solution: boolean | [number, any] | number = 0;

    if (!(SW.length === 1 || NW.length === 1)) {
        try {
            sol_w = BS_xMaxArea(
                AreaofRectanglefromXandRegion as (index: number, regName: string) => number,
                SW,
                "SW",
                x_min_w,
                x_max_w
            );
            west_solution = AreaofRectanglefromXandRegion(sol_w, "SW");
        } catch (error) {
            sol_w = undefined;
            west_solution = 0;
            console.error("west error: " + error);
        }

        if (isNaN(Number(west_solution))) {
            west_solution = 0;
        }
    }

    let sol_e = undefined;
    let east_solution: boolean | [number, any] | number = 0;

    if (!(SE.length === 1 || NE.length === 1)) {
        try {
            sol_e = BS_xMaxArea(
                AreaofRectanglefromXandRegion as (index: number, regionName: string) => number,
                SE,
                "SE",
                x_min_e,
                x_max_e
            );
            east_solution = AreaofRectanglefromXandRegion(sol_e, "SE");
        } catch (error) {
            sol_e = undefined;
            east_solution = 0;
            console.error("east error: " + error);
        }
        if (isNaN(Number(east_solution))) {
            east_solution = 0;
        }
    }

    let max_reg: string = '';
    let max_areaX: number = 0;
    let res: [number, Array<Point2D>] = [0, []];

    if (west_solution !== 0 || east_solution !== 0) {
        if (west_solution > east_solution) {
            max_areaX = Number(sol_w);
            max_reg = "SW";
        } else {
            max_areaX = Number(sol_e);
            max_reg = "SE";
        }
        try {
            res = AreaofRectanglefromXandRegion(max_areaX, max_reg, true) as [number, Array<Point2D>];
        } catch (error) {
            res = [0, []];
        }
    }

    const max_area = res[0];
    const max_rectangle = res[1];

    return [max_area, max_rectangle];
}

const getDomainFromRegion = ({region}: { region: string }): Array<Point2D> => {
    if (region === "SW") {
        return SW;
    } else if (region === "SE") {
        return SE;
    } else if (region === "NE") {
        return NE;
    } else if (region === "NW") {
        return NW;
    }
    throw new Error(`Unknown region: ${region}`);
}

/* Find the Area of a rectangle // to axes
the rectangle has 2 pts on the border of the
polygon with coordinate x*/
const AreaofRectanglefromXandRegion = (x: number, region: string, verbose = false): number | [number, Array<Point2D>] => {
    //region should be one of the four name "SW","SE","NE","NW"
    const domaine = getDomainFromRegion({region});

    let x_min = domaine[0].x;
    let x_max = domaine[domaine.length - 1].x;
    if (x_max < x_min) {
        let t = x_max;
        x_max = x_min;
        x_min = t;
    }
    if (x < x_min || x > x_max) {
        return 0;
    }
    let area = 0;
    let array_rect: Point2D[] = [];

    //first step : find intersection of x with polygon -> y1 & y2
    if (region === "SW" || region === "NW") {
        const v1 = BS_region(x_south, x, SW);
        const v2 = BS_region(x_north, x, NW);

        const y1 = find_y_intersection(SW[v1], SW[v1 + 1], x);
        const y2 = find_y_intersection(NW[v2], NW[v2 + 1], x);

        const E = SE.concat(NE);
        const v3 = BS_region(y_east, y1, E);
        const v4 = BS_region(y_east, y2, E);
        const u1 = find_x_intersection(E[v3], E[v3 + 1], y1);
        const u2 = find_x_intersection(E[v4], E[v4 + 1], y2);
        const u = Math.min(u1, u2);

        area = Math.abs((u - x) * (y2 - y1));
        array_rect = [
            new Point2D(x, y1),
            new Point2D(x, y2),
            new Point2D(u, y2),
            new Point2D(u, y1)
        ];
    }
    if (region === "SE" || region === "NE") {
        const v1 = BS_region(x_south, x, SE);
        const v2 = BS_region(x_north, x, NE);
        const y1 = find_y_intersection(SE[v1], SE[v1 + 1], x);
        const y2 = find_y_intersection(NE[v2], NE[v2 + 1], x);

        const W = NW.concat(SW);
        const v3 = BS_region(y_west, y1, W);
        const v4 = BS_region(y_west, y2, W);
        const u1 = find_x_intersection(W[v3], W[v3 + 1], y1);
        const u2 = find_x_intersection(W[v4], W[v4 + 1], y2);
        const u = Math.max(u1, u2);

        area = Math.abs((x - u) * (y2 - y1));
        array_rect = [
            new Point2D(x, y1),
            new Point2D(x, y2),
            new Point2D(u, y2),
            new Point2D(u, y1)
        ];
    }
    if (verbose) {
        return [area, array_rect];
    }

    return area;
}

const find_y_intersection = (p1: Point2D, p2: Point2D, x: number): number => {
    let m = (p2.y - p1.y) / (p2.x - p1.x);
    let p = p1.y - m * p1.x;

    return m * x + p;
}

const find_x_intersection = (p1: Point2D, p2: Point2D, y: number): number => {
    let m = (p2.y - p1.y) / (p2.x - p1.x);
    let p = p1.y - m * p1.x;

    return (y - p) / m;
}

export const getMaxRectangle = ({
                                    points,
                                    vertices,
                                }: {
    points: Array<Point2D>,
    vertices: Array<Point2D>,
}): Array<Point2D> => {
    if (vertices.length === 0) {
        return [];
    }
    let areaMax = 0;
    let rectMax: Point2D[] = [];
    computePossibleDirections({points});
    for (const direction in possibleDirections) {
        rotatePoints(
            possibleDirections[direction][0],
            possibleDirections[direction][1],
            FIRST,
            points,
            vertices,
        );
        const rectangleAreaAndVertices = searchLargestRectangle({points});
        if (rectangleAreaAndVertices[0] > areaMax) {
            rectMax = rectangleAreaAndVertices[1] as Point2D[];
            areaMax = rectangleAreaAndVertices[0] as number;
            rotatePoints(
                possibleDirections[direction][0],
                possibleDirections[direction][1],
                BACK,
                points,
                vertices,
            );
            rotatePoints(
                possibleDirections[direction][0],
                possibleDirections[direction][1],
                BACK,
                rectMax,
                vertices,
            );
        } else {
            rotatePoints(
                possibleDirections[direction][0],
                possibleDirections[direction][1],
                BACK,
                points,
                vertices,
            );
        }
    }
    return rectMax;
}

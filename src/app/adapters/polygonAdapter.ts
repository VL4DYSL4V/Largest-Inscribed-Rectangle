import {Point} from "../types/math";
import {Point2D} from "../dto/point2D";

export const pointToPoint2D = (point: Point): Point2D => {
    return new Point2D(point[0], point[1]);
}

export const point2DToPoint = (point2D: Point2D): Point => {
    return [point2D.x, point2D.y];
}


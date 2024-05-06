import React from "react";
import {Theme} from "../../styles/theme";
import {PolygonBounds} from "../../types/polygonTypes";
import {Point} from "../../types/math";
import {Triangulation} from "./Triangulation";
import {PolygonBoundsLines} from "./PolygonBounds";
import {stringifyPolygonPoints} from "./utils";
import {Polygon, Rect, SVG, TransparentPolygon} from "./styles";

export const SvgPolygon = ({
                               polygonPoints,
                               polygonBounds,
                               innerConvexHull = [],
                               triangulation = [],
                               maxRectangle = [],
                               id
                           }: {
    polygonPoints: Array<[number, number]>,
    innerConvexHull?: Array<[number, number]>,
    triangulation?: Array<Point[]>,
    polygonBounds?: PolygonBounds,
    maxRectangle?: Array<[number, number]>,
    id?: string,
}) => {
    const triangulationBoundsColor = Theme.red;
    const triangulationColor = Theme.aquaLight;
    const polygonBoundsColor = Theme.red;

    return (
        <SVG id={id}>
            <Rect x="0" y="0" fill={Theme.white}></Rect>

            <Polygon fill={Theme.black} points={stringifyPolygonPoints(polygonPoints)}/>
            <PolygonBoundsLines
                stroke={polygonBoundsColor}
                polygonBounds={polygonBounds}
            />
            <Triangulation
                triangulation={triangulation}
                stroke={triangulationBoundsColor}
                fill={triangulationColor}
                opacity={0.4}
            />
            <TransparentPolygon
                fill={Theme.red}
                points={stringifyPolygonPoints(innerConvexHull)}
                opacity={0.5}
            />
            <Polygon
                fill={Theme.red}
                points={stringifyPolygonPoints(maxRectangle)}
            />
        </SVG>
    )
}

import React from "react";
import {Theme} from "../../styles/theme";
import {PolygonBounds} from "../../types/polygonTypes";
import {Point} from "../../types/math";
import {Triangulation} from "./Triangulation";
import {PolygonBoundsLines} from "./PolygonBounds";
import {stringifyPolygonPoints} from "./utils";
import {Polygon, Rect, SVG} from "./styles";

export const SvgPolygon = ({
                               polygonPoints,
                               polygonBounds,
                               triangulation = [],
                               innerTriangulation = [],
                               id
                           }: {
    polygonPoints: Array<[number, number]>,
    triangulation?: Array<Point[]>,
    innerTriangulation?: Array<Point[]>,
    polygonBounds?: PolygonBounds,
    id?: string,
}) => {
    const triangulationBoundsColor = Theme.red;
    const triangulationColor = Theme.aqua;
    const innerTriangulationColor = Theme.violetLight;
    const polygonBoundsColor = Theme.red;

    return (
        <SVG id={id}>
            <Rect x="0" y="0" fill={Theme.white}></Rect>

            <Polygon fill={Theme.darkGrey2} points={stringifyPolygonPoints(polygonPoints)}/>
            <PolygonBoundsLines
                stroke={polygonBoundsColor}
                polygonBounds={polygonBounds}
            />
            <Triangulation
                triangulation={triangulation}
                stroke={triangulationBoundsColor}
                fill={triangulationColor}
            />
            <Triangulation
                triangulation={innerTriangulation}
                stroke={triangulationBoundsColor}
                fill={innerTriangulationColor}
            />
        </SVG>
    )
}

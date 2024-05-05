import {Point} from "../../types/math";
import {Theme} from "../../styles/theme";
import React from "react";
import {SVGLine, TransparentPolygon} from "./styles";
import {stringifyPolygonPoints} from "./utils";

export const Triangulation = ({
                                  triangulation,
                                  fill = Theme.aqua,
                                  stroke = Theme.red,
    opacity = 0.5,
                              }: {
    triangulation: Array<Point[]>,
    fill?: string,
    stroke?: string,
    opacity?: number,
}) => {
    return (
        <>
            {
                triangulation.map(points => {
                    const point1 = points[0];
                    const point2 = points[1];
                    const point3 = points[2];
                    return (
                        <>
                            <TransparentPolygon
                                opacity={opacity}
                                fill={fill}
                                points={stringifyPolygonPoints(points)}
                            />
                            <SVGLine x1={point1[0]} y1={point1[1]} x2={point2[0]} y2={point2[1]} stroke={stroke}/>
                            <SVGLine x1={point1[0]} y1={point1[1]} x2={point3[0]} y2={point3[1]} stroke={stroke}/>
                            <SVGLine x1={point2[0]} y1={point2[1]} x2={point3[0]} y2={point3[1]} stroke={stroke}/>
                        </>
                    )
                })
            }
        </>
    )
}

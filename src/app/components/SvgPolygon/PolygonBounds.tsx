import {PolygonBounds} from "../../types/polygonTypes";
import React from "react";
import {SVGLine} from "./styles";
import {Theme} from "../../styles/theme";

export const PolygonBoundsLines = ({
                                       polygonBounds,
                                       stroke = Theme.red,
                                   }: {
    polygonBounds?: PolygonBounds,
    stroke?: string
}) => {
    if (!polygonBounds) {
        return null;
    }
    const {topLeft, topRight, bottomLeft, bottomRight} = polygonBounds;

    return (
        <>
            <SVGLine x1={topLeft[0]} y1={topLeft[1]} x2={topRight[0]} y2={topRight[1]} stroke={stroke}/>
            <SVGLine x1={topRight[0]} y1={topRight[1]} x2={bottomRight[0]} y2={bottomRight[1]} stroke={stroke}/>
            <SVGLine x1={bottomRight[0]} y1={bottomRight[1]} x2={bottomLeft[0]} y2={bottomLeft[1]} stroke={stroke}/>
            <SVGLine x1={bottomLeft[0]} y1={bottomLeft[1]} x2={topLeft[0]} y2={topLeft[1]} stroke={stroke}/>
        </>
    )
}

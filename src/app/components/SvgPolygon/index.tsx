import React from "react";
import styled from "styled-components";
import {Theme} from "../../styles/theme";

const SVG = styled.svg`

  width: 100%;
  height: 100%;

`;

const Rect = styled.rect<{ fill?: string }>`
  width: 100%;
  height: 100%;

  fill: ${({fill}: { fill?: string }) => fill ? fill : ''};
`;

const Polygon = styled.polygon<{ fill?: string }>`

  width: 100%;
  height: 100%;
  
  fill: ${({fill}: { fill?: string }) => fill ? fill : ''};

`;

const stringifyPolygonPoints = (points: Array<Array<number>>): string => {
    return points
        .flatMap(point => point.join(','))
        .join(' ')
}

export const SvgPolygon = ({
                               polygonPoints,
                               id
                           }: {
    polygonPoints: Array<Array<number>>,
    id?: string,
}) => {

    return (
        <SVG id={id}>
            <Rect x="0" y="0" fill={Theme.white}></Rect>

            <Polygon fill={Theme.darkGrey2} points={stringifyPolygonPoints(polygonPoints)}/>

        </SVG>
    )
}

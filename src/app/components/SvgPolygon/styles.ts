import styled from "styled-components";
import {Theme} from "../../styles/theme";

export const SVG = styled.svg`

  width: 100%;
  height: 100%;

`;

export const SVGLine = styled.line<{ stroke?: string }>`
  stroke-width: 2;

  stroke: ${({stroke = Theme.red}: { stroke?: string }) => stroke || ''};
`

export const Rect = styled.rect<{ fill?: string }>`
  width: 100%;
  height: 100%;

  fill: ${({fill}: { fill?: string }) => fill ? fill : ''};
`;

export const Polygon = styled.polygon<{ fill?: string }>`

  width: 100%;
  height: 100%;

  fill: ${({fill}: { fill?: string }) => fill ? fill : ''};

`;

export const TransparentPolygon = styled.polygon<{ fill?: string }>`

  width: 100%;
  height: 100%;

  fill: ${({fill}: { fill?: string }) => fill ? fill : ''};
  opacity: 0.5;

`;

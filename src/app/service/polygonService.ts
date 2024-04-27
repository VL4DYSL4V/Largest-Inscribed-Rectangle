import * as geometric from 'geometric';

export const getRandomPolygon = ({
    sides,
    area,
    center,
}: {
    sides?: number,
    area?: number,
    center?: [number, number]
}): Array<Array<number>> => {
    return geometric.polygonRegular(sides, area, center);
}

import {getRandomInt, getRandomNumbersInInterval} from "../utils/randomUtils";

const toRadians = (angle: number): number => {
    return angle * (Math.PI / 180);
}

const generatePolygon = ({ center, sides, maxRadius, centerPadding }: {
    center: [number, number],
    sides: number,
    centerPadding: number,
    maxRadius: number,
}): Array<[number, number]> => {
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
}): Array<Array<number>> => {
    return generatePolygon({
        center,
        sides,
        maxRadius,
        centerPadding
    });
}

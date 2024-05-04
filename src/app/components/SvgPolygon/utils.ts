export const stringifyPolygonPoints = (points: Array<Array<number>>): string => {
    return points
        .flatMap(point => point.join(','))
        .join(' ')
}

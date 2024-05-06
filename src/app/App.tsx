import React from 'react';
import {
    AppScreen,
    AppScreenContentWrapper,
    AppScreenControlsPanel,
    AppScreenControlsText
} from "./components/AppScreen";
import {InputText} from "./components/InputText";
import {Button} from "./components/Button";
import {SvgContainer} from "./components/SvgContainer";
import {SvgPolygon} from "./components/SvgPolygon";
import {ComponentIds} from "./enums/componentIds";
import {getInnerConvexHull, getRandomPolygon} from "./service/polygonService";
import {PolygonBounds, PolygonParams} from "./types/polygonTypes";
import {Point} from "./types/math";
import {point2DToPoint, pointToPoint2D} from "./adapters/polygonAdapter";


const getPolygonParams = (): PolygonParams => {
    const polygonBoundingRect = document.getElementById(ComponentIds.SVG_POLYGON)?.getBoundingClientRect() || {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    };

    const centerX = polygonBoundingRect.width / 2;
    const centerY = polygonBoundingRect.height / 2;

    return {
        width: polygonBoundingRect.width,
        height: polygonBoundingRect.height,
        center: [centerX, centerY],
    }
}

function App() {
    const [amountOfPoints, setAmountOfPoints] = React.useState<number>(50);
    const [polygon, setPolygon] = React.useState<Array<[number, number]>>([]);
    const [polygonParams, setPolygonParams] = React.useState<PolygonParams | undefined>(undefined);
    const [polygonBounds, setPolygonBounds] = React.useState<PolygonBounds | undefined>(undefined);
    const [triangulation, setTriangulation] = React.useState<Array<Point[]> | undefined>(undefined);
    const [innerConvexHull, setInnerConvexHull] = React.useState<Array<[number, number]> | undefined>(undefined);
    const [maxRectangle, setMaxRectangle] = React.useState<Array<[number, number]> | undefined>(undefined);

    const onInputAmountOfPoints = (value: string) => {
        const asNumber = Number(value);
        if (isNaN(asNumber) || asNumber < 3) {
            return;
        }
        setAmountOfPoints(asNumber);
    }

    const clearSolution = () => {
        setPolygonBounds(undefined);
        setPolygonParams(undefined);
        setTriangulation(undefined);
        setInnerConvexHull(undefined);
        setMaxRectangle(undefined);
    }

    const onRegeneratePolygon = () => {
        clearSolution();

        const polygonParams = getPolygonParams();
        const polygon = getRandomPolygon({
            sides: amountOfPoints,
            center: polygonParams.center,
            centerPadding: Math.min(polygonParams.width / 7, polygonParams.height / 7),
            maxRadius: Math.min(polygonParams.width / 2.3, polygonParams.height / 2.3),
        });
        setPolygon(polygon);
        setPolygonParams(polygonParams);
    }

    const onBuildLargestInscribedRectangle = () => {
        if (!polygonParams) {
            return;
        }
        const innerConvexHull = getInnerConvexHull({
            polygon,
        });
        setInnerConvexHull(innerConvexHull);

        // @ts-ignore
        window.points = innerConvexHull.map(pointToPoint2D);
        // @ts-ignore
        window.convexhull();
        // @ts-ignore
        window.launchAlgorithm();
        // @ts-ignore
        const maxRectangleGeometric = window.array_r.map(point2DToPoint);
        setMaxRectangle(maxRectangleGeometric);
    }

    React.useEffect(() => {
        clearSolution();
        onRegeneratePolygon();
    }, []);

    return (
        <AppScreen>
            <AppScreenContentWrapper>
                <AppScreenControlsPanel>
                    <AppScreenControlsText>
                        Set amount of polygon points:
                    </AppScreenControlsText>
                    <InputText
                        type="number"
                        value={amountOfPoints}
                        onChange={(e) => onInputAmountOfPoints(e.target.value)}
                    />
                    <Button
                        onClick={onRegeneratePolygon}
                    >
                        Regenerate polygon
                    </Button>
                    <Button
                        onClick={onBuildLargestInscribedRectangle}
                    >
                        Build Largest Inscribed Rectangle
                    </Button>
                </AppScreenControlsPanel>

                <SvgContainer>
                    <SvgPolygon
                        polygonPoints={polygon}
                        id={ComponentIds.SVG_POLYGON}
                        polygonBounds={polygonBounds}
                        triangulation={triangulation}
                        innerConvexHull={innerConvexHull}
                        maxRectangle={maxRectangle}
                    />
                </SvgContainer>
            </AppScreenContentWrapper>
        </AppScreen>
    );
}

export default App;

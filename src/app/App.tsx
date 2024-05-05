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
import {
    flattenInnerTriangulation, getInnerConvexHull,
    getInnerTriangulation,
    getPolygonBounds,
    getPolygonHull,
    getRandomPolygon,
    getTriangulationPiecesOfBiggestAreaWithNoPointsInside
} from "./service/polygonService";
import {PolygonBounds, PolygonParams} from "./types/polygonTypes";
import {triangulate} from "./service/triangulationService";
import {Point, Polygon} from "./types/math";


const getPolygonParams = (): PolygonParams => {
    const polygonBoundingRect = document.getElementById(ComponentIds.SVG_POLYGON)?.getBoundingClientRect() || {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    };

    const centerX = polygonBoundingRect.width / 2;
    const centerY = polygonBoundingRect.height / 2;

    return  {
        width: polygonBoundingRect.width,
        height: polygonBoundingRect.height,
        center: [centerX, centerY],
    }
}

function App() {
    const [amountOfPoints, setAmountOfPoints] = React.useState<number>(20);
    const [polygon, setPolygon] = React.useState<Array<[number, number]>>([]);
    const [polygonParams, setPolygonParams] = React.useState<PolygonParams | undefined>(undefined);
    const [polygonBounds, setPolygonBounds] = React.useState<PolygonBounds | undefined>(undefined);
    const [triangulation, setTriangulation] = React.useState<Array<Point[]> | undefined>(undefined);
    const [innerTriangulation, setInnerTriangulation] = React.useState<Array<Point[]> | undefined>(undefined);
    const [innerConvexHull, setInnerConvexHull] = React.useState<Array<[number, number]> | undefined>(undefined);


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
        setInnerTriangulation(undefined);
        setInnerConvexHull(undefined);
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
        const polygonBounds = getPolygonBounds({polygon: polygon});
        setPolygonBounds(polygonBounds);
        const triangulation = triangulate({ polygon });
        setTriangulation(triangulation);
        const innerTriangulation = getInnerTriangulation({
            polygon,
            convexTriangulation: triangulation,
            scaleFactor: 0.999,
        });
        setInnerTriangulation(innerTriangulation);

        const innerConvexHull = getInnerConvexHull({
            polygon,
        });
        setInnerConvexHull(innerConvexHull);
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
                        innerTriangulation={innerTriangulation}
                        innerConvexHull={innerConvexHull}
                    />
                </SvgContainer>
            </AppScreenContentWrapper>
        </AppScreen>
    );
}

export default App;

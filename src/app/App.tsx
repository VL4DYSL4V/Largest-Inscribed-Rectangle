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
import {getRandomPolygon} from "./service/polygonService";
import {PolygonParams} from "./types/polygonTypes";


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
    const [polygonPoints, setPolygonPoints] = React.useState<Array<Array<number>>>([]);
    const [polygonParams, setPolygonParams] = React.useState<PolygonParams | {}>({});

    const onInputAmountOfPoints = (value: string) => {
        const asNumber = Number(value);
        if (isNaN(asNumber) || asNumber < 3) {
            return;
        }
        setAmountOfPoints(asNumber);
    }

    const onRegeneratePolygon = () => {
        const polygonParams = getPolygonParams();
        const polygon = getRandomPolygon({
            sides: amountOfPoints,
            center: polygonParams.center,
            centerPadding: Math.min(polygonParams.width / 7, polygonParams.height / 7),
            maxRadius: Math.min(polygonParams.width / 2.3, polygonParams.height / 2.3),
        });
        setPolygonParams(polygonParams);
        setPolygonPoints(polygon);
    }

    const onBuildLargestInscribedRectangle = () => {

    }

    React.useEffect(() => {
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
                    <SvgPolygon polygonPoints={polygonPoints} id={ComponentIds.SVG_POLYGON}/>
                </SvgContainer>
            </AppScreenContentWrapper>
        </AppScreen>
    );
}

export default App;

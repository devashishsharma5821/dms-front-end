import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import FitToContent from '../../assets/icons/FitToContent';
import ZoomInIcon from '../../assets/icons/ZoomInIcon';
import ZoomOutIcon from '../../assets/icons/ZoomOutIcon';
const ZoomComponent = (props: any) => {
    const [dotSpace, setDotSpace] = React.useState<any>(20);
    const [dotSize, setDotSize] = React.useState<any>(1);
    const zoomIn = () => {
        props.paperScroll.zoom(0.2, { max: 4 });
        if (dotSpace < 80) setDotSpace(dotSpace + 4);
        if (dotSize < 4) setDotSize(dotSize + 0.2);
    };
    const zoomOut = () => {
        props.paperScroll.zoom(-0.2, { min: 0.2 });
        if (dotSpace > 4) setDotSpace(dotSpace - 4);
        if (dotSize > 0.4) setDotSize(dotSize - 0.2);
    };

    const fitToContent = () => {
        const opt = {padding:150, scaleGrid:0.2}
        props.paperScroll.zoomToFit(opt);
        props.paperScroll.zoomToRect();
    };
    return (
        <>
            <Box position="absolute" zIndex={10} bottom="50px" right="10px" display="flex" flexDirection="column">
                <IconButton aria-label="Fit" variant="outline" icon={<FitToContent />} onClick={fitToContent} height={57} width="var(--chakra-space-56)" marginBottom={16} />
                <IconButton aria-label="Zoom In" variant="outline" icon={<ZoomInIcon />} onClick={zoomIn} height={57} width="var(--chakra-space-56)" borderBottomRadius="none" />
                <IconButton aria-label="Zoom Out" variant="outline" icon={<ZoomOutIcon />} onClick={zoomOut} height={57} width="var(--chakra-space-56)" borderTopRadius="none" />
            </Box>
        </>

    );
};

export default ZoomComponent;

import { Button, ListItem, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { specifiedDirectives } from "graphql";
import {
    AggregationDisaggregationIcon, AnomalyDetectionIcon, ArtificialNeuralNetworkIcon,
    CustomTransformersIcon, DataFrameManipulationIcon, FeatureExtractionIcon, KeyPerformanceIndicatorIcon,
    MachineLearningModelsIcon, PromotionModelsIcon, TimeSeriesModelsIcon, TransformersIcon,
    AggregationDisaggregationIcon_black, AnomalyDetectionIcon_black, ArtificialNeuralNetworkIcon_black,
    CustomTransformersIcon_black, DataFrameManipulationIcon_black, FeatureExtractionIcon_black, KeyPerformanceIndicatorIcon_black,
    MachineLearningModelsIcon_black, PromotionModelsIcon_black, TimeSeriesModelsIcon_black, TransformersIcon_black
} from "../../assets/icons/AllTransformerIcons";




const TransformerMenuItem = (props: any) => {

    const accordianItemBg = useColorModeValue(props.config.backgroundLight, props.config.backgroundDark);
    const accordianItemBorder = useColorModeValue(props.config.borderLight, props.config.borderDark);
    const accordianTextColor = useColorModeValue('light.veryDarkBlue', 'dark.veryDarkGray');
    const {colorMode} = useColorMode();
    const iconComponents: any = {
        'AggregationDisaggregationIcon': AggregationDisaggregationIcon,
        'TransformersIcon': TransformersIcon,
        'AnomalyDetectionIcon': AnomalyDetectionIcon,
        'PromotionModelsIcon': PromotionModelsIcon,
        'TimeSeriesModelsIcon': TimeSeriesModelsIcon,
        'FeatureExtractionIcon': FeatureExtractionIcon,
        'DataFrameManipulationIcon': DataFrameManipulationIcon,
        'ArtificialNeuralNetworkIcon': ArtificialNeuralNetworkIcon,
        'KeyPerformanceIndicatorIcon': KeyPerformanceIndicatorIcon,
        'MachineLearningModelsIcon': MachineLearningModelsIcon,
        'CustomTransformersIcon': CustomTransformersIcon,
    };
    const iconComponentsDark: any = {
        'AggregationDisaggregationIcon': AggregationDisaggregationIcon_black,
        'TransformersIcon': TransformersIcon_black,
        'AnomalyDetectionIcon': AnomalyDetectionIcon_black,
        'PromotionModelsIcon': PromotionModelsIcon_black,
        'TimeSeriesModelsIcon': TimeSeriesModelsIcon_black,
        'FeatureExtractionIcon': FeatureExtractionIcon_black,
        'DataFrameManipulationIcon': DataFrameManipulationIcon_black,
        'ArtificialNeuralNetworkIcon': ArtificialNeuralNetworkIcon_black,
        'KeyPerformanceIndicatorIcon': KeyPerformanceIndicatorIcon_black,
        'MachineLearningModelsIcon': MachineLearningModelsIcon_black,
        'CustomTransformersIcon': CustomTransformersIcon_black,
    }

    const CurrentComponent = (colorMode === 'light')?iconComponents[props.config.icon]:iconComponentsDark[props.config.icon];

    return (
        <ListItem id={'list-' + props.index}>
            <Button leftIcon={<CurrentComponent />} h="52px" boxShadow="0px 3px 3px rgba(0, 0, 0, 0.08);" borderRadius="4px"
                justifyContent="flex-start" textAlign="left"  borderColor={accordianItemBorder} bg={accordianItemBg}
                _hover={{ background: accordianItemBg }} color={accordianTextColor} colorScheme='teal' variant='outline' width='257px'>{props.name}</Button>
        </ListItem>
    )
}

export default TransformerMenuItem;
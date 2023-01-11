// import { Settings, Output, VariableToolbar, SaveAs, MoreIconToolbar, DeployPipelineButton, DeployedIcon, DownArrowToolbar } from '../assets/icons';
import Settings from '../assets/icons/Settings';
import DownArrowToolbar from '../assets/icons/DownArrowToolbar';
import Output from '../assets/icons/Output';
import VariableToolbar from '../assets/icons/VariableToolbar';
import SaveAs from '../assets/icons/SaveAs';
import MoreIconToolbar from '../assets/icons/MoreIconToolbar';
import DeployedIcon from '../assets/icons/DeployedIcon';
import DeployPipelineButton from '../assets/icons/DeployPipelineButton';
const toolbarDataIcons = {
    section1:  [
        {
            component: <Settings />,
            name: 'Properties',
            type: 'icon'
        },
        {
            component: <Output />,
            name: 'Output',
            type: 'icon'
        },
        {
            component: <VariableToolbar />,
            name: 'Variables',
            type: 'icon'
        },
        {
            component: <SaveAs />,
            name: 'SaveAs',
            type: 'icon'
        },
        { component: <MoreIconToolbar />, name: 'Run', type: 'moreIcon' },

        {
            name: 'Comments',
            type: 'switch'
        },

        {
            name: 'Run',
            type: 'button',
            disabled: false
        },
        { component: <DeployPipelineButton />, name: 'Deploy Pipeline', type: 'pipelineButton', disabled: true }
    ],
    section2:  [
        { component: <DeployedIcon />, name: 'my-compute1', type: 'deployedIcon' },
        {
            gb: '8 GB',
            core: '4 Core',
            type: 'serverInfo'
        },
        { component: <DownArrowToolbar />, name: 'downArrow', type: 'downArrow' }
    ]
}

export default toolbarDataIcons;

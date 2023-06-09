import {
    CreateIcon,
    WhiteHome,
    WhiteRecentIcon,
    WhiteExperiment,
    WhiteCollection,
    WhiteComputeIcon,
    WhiteDatasetIcon,
    WhiteNotebookIcon,
    WhiteArtifactsIcon,
    WhiteWorkflowsIcon,
    PipelineIcon,
    WhiteInfoIcon,
    WhiteSettingIcon,
    WhiteFluentIcon
} from '../assets/icons';
import ParametersIcon from '../assets/icons/ParametersIcon';

const sideBarMenuIcons = [
    {
        section: [
            {
                icon: <CreateIcon />,
                iconName: 'Create',
                hasSubMenu: [],
                isClicked: false,
                disabled: false
            },
            {
                icon: <WhiteHome color="#99A1B2" />,
                iconName: 'Home',
                route: '/home',
                disabled: true
            },
            {
                icon: <WhiteRecentIcon color="#99A1B2" />,
                iconName: 'Recent',
                hasSubMenu: [],
                isClicked: false,
                disabled: true
            },
            {
                icon: <WhiteExperiment color="#99A1B2" />,
                iconName: 'Explorer',
                hasSubMenu: [],
                isClicked: false,
                disabled: false
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteCollection color="#99A1B2" />,
                iconName: 'Projects',
                route: '/projects',
                disabled: false
            },
            {
                icon: <PipelineIcon />,
                iconName: 'Pipeline',
                route: '/notfound',
                disabled: true
            },
            {
                icon: <WhiteComputeIcon color="#99A1B2" />,
                iconName: 'Compute',
                route: '/compute',
                disabled: false
            },
            {
                icon: <WhiteDatasetIcon color="#99A1B2" />,
                iconName: 'Dataset',
                route: '/dataset',
                disabled: false
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteNotebookIcon color="#99A1B2" />,
                iconName: 'Notebook',
                route: '/notebook',
                disabled: true
            },
            {
                icon: <WhiteArtifactsIcon />,
                iconName: 'Artifact Store',
                route: '/notfound',
                disabled: true
            },
            {
                icon: <WhiteWorkflowsIcon color="#99A1B2" />,
                iconName: 'Workflows',
                route: '/notfound',
                disabled: true
            },
            {
                icon: <ParametersIcon color="#99A1B2" />,
                iconName: 'Parameters',
                route: '/notfound',
                disabled: true
            }
        ]
    },

    {
        section: [
            {
                icon: <WhiteInfoIcon color="#99A1B2" />,
                iconName: 'Help',
                hasSubMenu: [],
                isClicked: false,
                disabled: true
            },
            {
                icon: <WhiteFluentIcon />,
                iconName: 'Auto Expand',
                route: '/notfound',
                disabled: true
            }
        ]
    }
];
export default sideBarMenuIcons;

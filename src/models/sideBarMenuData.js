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

const sideBarMenuIcons = [
    {
        section: [
            {
                icon: <CreateIcon />,
                iconName: 'Create',
                route: '/project'
            },
            {
                icon: <WhiteHome />,
                iconName: 'Home',
                route: '/notfound'
            },
            {
                icon: <WhiteRecentIcon />,
                iconName: 'Recent',
                route: '/notfound'
            },
            {
                icon: <WhiteExperiment />,
                iconName: 'Explorer',
                route: '/notfound'
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteCollection />,
                iconName: 'Projects',
                route: '/notfound'
            },
            {
                icon: <PipelineIcon />,
                iconName: 'Pipeline',
                route: '/notfound'
            },
            {
                icon: <WhiteComputeIcon />,
                iconName: 'Compute',
                route: '/compute'
            },
            {
                icon: <WhiteDatasetIcon />,
                iconName: 'Dataset',
                route: '/notfound'
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteNotebookIcon />,
                iconName: 'Notebook',
                route: '/notebook'
            },
            {
                icon: <WhiteArtifactsIcon />,
                iconName: 'Artifact Store',
                route: '/notfound'
            },
            {
                icon: <WhiteWorkflowsIcon />,
                iconName: 'Workflows',
                route: '/notfound'
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteInfoIcon />,
                iconName: 'Help',
                route: '/notfound'
            },
            {
                icon: <WhiteSettingIcon />,
                iconName: 'Settings',
                route: '/notfound'
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteFluentIcon />,
                iconName: 'Auto Expand',
                route: '/notfound'
            }
        ]
    }
];
export default sideBarMenuIcons;

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
    WhiteDocumentationIcon,
    WhiteResourceCenterIcon,
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
                iconName: 'Experiment',
                route: '/notfound'
            },
            {
                icon: <WhiteCollection />,
                iconName: 'Collection',
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
                iconName: 'Artifacts',
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
                icon: <WhiteDocumentationIcon />,
                iconName: 'Documentation',
                route: '/notfound'
            },
            {
                icon: <WhiteResourceCenterIcon />,
                iconName: 'ResourceCenter',
                route: '/notfound'
            },
            {
                icon: <WhiteInfoIcon />,
                iconName: 'Info',
                route: '/notfound'
            },
            {
                icon: <WhiteSettingIcon />,
                iconName: 'Setting',
                route: '/notfound'
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteFluentIcon />,
                iconName: 'Fluent',
                route: '/notfound'
            }
        ]
    }
];
export default sideBarMenuIcons;

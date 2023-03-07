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
                hasSubMenu: [],
                isClicked: false,
                disabled: false
            },
            {
                icon: <WhiteHome />,
                iconName: 'Home',
                route: '/home',
                disabled: true
            },
            {
                icon: <WhiteRecentIcon color="white"/>,
                iconName: 'Recent',
                hasSubMenu: [],
                isClicked: false,
                disabled: true
            },
            {
                icon: <WhiteExperiment color="white" />,
                iconName: 'Explorer',
                hasSubMenu: [],
                isClicked: false,
                disabled: true
            },
              { 
                icon: <WhiteInfoIcon color="white"/>,
                iconName: 'Help',
                hasSubMenu: [],
                isClicked: false,
                  disabled: true
            },
        ]
    },
    {
        section: [
            {
                icon: <WhiteCollection color="white"/>,
                iconName: 'Projects',
                route: '/project',
                disabled: false
            },
            {
                icon: <PipelineIcon />,
                iconName: 'Pipeline',
                route: '/notfound',
                disabled: true
            },
            {
                icon: <WhiteComputeIcon color="white"/>,
                iconName: 'Compute',
                route: '/compute',
                disabled: false
            },
            {
                icon: <WhiteDatasetIcon color="white"/>,
                iconName: 'Dataset',
                route: '/notfound',
                disabled: true
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteNotebookIcon color="white"/>,
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
                icon: <WhiteWorkflowsIcon color="white"/>,
                iconName: 'Workflows',
                route: '/notfound',
                disabled: true
            }
        ]
    },
    {
        section: [
          
            {
                icon: <WhiteSettingIcon />,
                iconName: 'Settings',
                route: '/notfound',
                disabled: true
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteFluentIcon />,
                iconName: 'Auto Expand',
                route: '/notfound',
                disabled: true
            }
        ]
    },

];
export default sideBarMenuIcons;

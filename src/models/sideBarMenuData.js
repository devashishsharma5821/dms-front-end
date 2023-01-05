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
                isClicked: false
            },
            {
                icon: <WhiteHome />,
                iconName: 'Home',
                route: '/home'
            },
            {
                icon: <WhiteRecentIcon color="white"/>,
                iconName: 'Recent',
                hasSubMenu: [],
                isClicked: false
            },
            {
                icon: <WhiteExperiment color="white" />,
                iconName: 'Explorer',
                hasSubMenu: [],
                isClicked: false
            },
              { 
                icon: <WhiteInfoIcon color="white"/>,
                iconName: 'Help',
                hasSubMenu: [],
                isClicked: false
            },
        ]
    },
    {
        section: [
            {
                icon: <WhiteCollection color="white"/>,
                iconName: 'Projects',
                route: '/notfound'
            },
            {
                icon: <PipelineIcon />,
                iconName: 'Pipeline',
                route: '/notfound'
            },
            {
                icon: <WhiteComputeIcon color="white"/>,
                iconName: 'Compute',
                route: '/compute'
            },
            {
                icon: <WhiteDatasetIcon color="white"/>,
                iconName: 'Dataset',
                route: '/notfound'
            }
        ]
    },
    {
        section: [
            {
                icon: <WhiteNotebookIcon color="white"/>,
                iconName: 'Notebook',
                route: '/notebook'
            },
            {
                icon: <WhiteArtifactsIcon />,
                iconName: 'Artifact Store',
                route: '/notfound'
            },
            {
                icon: <WhiteWorkflowsIcon color="white"/>,
                iconName: 'Workflows',
                route: '/notfound'
            }
        ]
    },
    {
        section: [
          
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
    },

];
export default sideBarMenuIcons;

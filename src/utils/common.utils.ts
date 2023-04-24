import { AllUsers } from '../models/profile';
import { GetAllProjectsDetail } from '../models/project';
import moment from 'moment';
import { keys, startCase } from 'lodash';
import { ColDef } from 'ag-grid-community';
import { shapes } from '@antuit/rappid-v1';

export const getColDefsForDataset = (dataForSampleRows: any) => {
    const colDefKeysSchema = [
        {
            field: 'col_name',
            headerName: 'Col_name'
        },
        {
            field: 'data_type',
            headerName: 'Data_type'
        },
        {
            field: 'comment',
            headerName: 'Comment'
        }
    ];
    const colDefKeys = keys(dataForSampleRows);
    const colDef = colDefKeys.map((headerKeys: string) => {
        return { headerName: startCase(headerKeys), field: headerKeys } as ColDef;
    });
    return {
        colDefKeysSchema,
        colDef
    }
};

export const getRowDataForDataset = (data: any) => {
    const rowDataForSchema = data['schema'].map((row: any) => {
        return {
            col_name: row[0],
            data_type: row[1],
            comment: row[2]
        };
    });
    const rowDataForSample = data['sample_rows'];

    return {
        rowDataForSchema,
        rowDataForSample
    }
}

export const convertApolloError = (error: any) => {
    const keyToIgnore = ":";
    const indexOfError = error.toString().indexOf(keyToIgnore);
    const errorString = error.toString().substring(indexOfError + 1);
    return errorString;
};
export const getProjectAccessList = (projectList: any, selectedProject: string) => {
    if (selectedProject === '') {
        return projectList[0].project_access;
    } else {
        return projectList.filter((project: any) => {
            return project.id.toString() === selectedProject;
        })[0].project_access;
    }
};
export const getProjectNameAndLabelsForSelect = (projectList: GetAllProjectsDetail[]) => {
    const projectsName = projectList.map((project) => {
        return {
            name: project.name,
            id: project.id
        };
    });
    return projectsName.sort((p1, p2) => (p1.name > p2.name ? 1 : p1.name < p2.name ? -1 : 0));
};
export const copyToClipBoard = (copyMessage: string, callBack: any) => {
    navigator.clipboard.writeText(copyMessage).then(() => {
        callBack();
    });
};
export const convertTime = (date: any, isLastModifiedNeeded: boolean) => {
    if (isLastModifiedNeeded) {
        return moment.utc(date).local().fromNow();
    } else {
        return moment.utc(date).local().format('MM/DD/YYYY HH:MM A');
    }
};

export const getUserNameFromId = (userData: AllUsers[], userId: string) => {
    const currentUser = userData?.filter((user: AllUsers) => {
        return user.userId === userId;
    });
    const fullName = `${currentUser![0]?.firstName} ${currentUser![0]?.lastName}`;
    return fullName;
};

export const getUserNameFromIdInitials = (userData: AllUsers[], userId: string) => {
    const currentUser = userData?.filter((user: AllUsers) => {
        return user.userId === userId;
    });
    const initials = `${currentUser![0]?.firstName[0]}${currentUser![0]?.lastName[0]}`;
    return initials;
};

export const getTruncatedText = (name: string, size: number) => {
    if (name?.length >= size) {
        const newName = `${name.slice(0, size)}...`;
        return newName;
    } else {
        return name;
    }
};

export const getFormattedUserData = (allUserData: AllUsers[], projectData: any) => {
    const reformattedProjectAccessData = projectData.project_access.map((singleProjectAccess: any, projectAccessIndex: any) => {
        const sharedUser = allUserData?.filter((singleUser) => {
            return singleUser.userId === singleProjectAccess.user_id;
        });
        return {
            id: sharedUser![0].userId,
            firstName: sharedUser?.length > 0 ? sharedUser![0].firstName : '',
            lastName: sharedUser?.length > 0 ? sharedUser![0].lastName : '',
            email: sharedUser?.length > 0 ? sharedUser![0].email : '',
            accessLevel: sharedUser?.length > 0 ? projectData.project_access[projectAccessIndex].access_level : ''
        };
    });

    return reformattedProjectAccessData;
};

export const projectsSearch = (projectData: any, keyword: any, AllUsersData: any) => {
    const searchTerm = keyword.toLowerCase();
    return projectData.filter((project: any) => {
        const user = getUserNameFromId(AllUsersData, project.created_by);
        return project.name.toLowerCase().match(new RegExp(searchTerm, 'g')) ||
        project.id.toLowerCase().match(new RegExp(searchTerm, 'g')) ||
        user.toLowerCase().match(new RegExp(searchTerm, 'g')) ||
        project.project_access.filter((access: any) => {
            const userFilteredProjectAccess = getUserNameFromIdInitials(AllUsersData, access.user_id);
            return userFilteredProjectAccess.toLowerCase().match(new RegExp(searchTerm, 'g'));
        }).length > 0
            ? true
            : false;
    });
};

export const projectsSearchByNameOnly = (projectData: any, keyword: any) => {
    const searchTerm = keyword.toLowerCase();
    return projectData.filter((project: any) => {
        return project.name.toLowerCase().match(new RegExp(searchTerm, 'g'));
    });
};

export const handleProjectsFilter = (userConfig: any, allProjectsData: any, type: string, projectSelected?: string) => {
    let projectFilteredData = [];
    if (projectSelected) {
        if (projectSelected === 'All') {
            projectFilteredData = allProjectsData;
        } else {
            projectFilteredData = allProjectsData.filter((project: GetAllProjectsDetail) => {
                return project.id === projectSelected;
            });
        }
    } else {
        projectFilteredData = allProjectsData;
    }
    if (type === 'All') {
        return projectFilteredData;
    } else if (type === 'onlyMe') {
        const userId = userConfig.userConfiguration.user.userId;
        const userOnlyProjects = projectFilteredData.filter((project: GetAllProjectsDetail) => {
            return project.created_by === userId;
        });
        return userOnlyProjects;
    } else if (type === 'sharedWithMe') {
        const userId = userConfig.userConfiguration.user.userId;
        const sharedWithMe = projectFilteredData.filter((project: GetAllProjectsDetail) => {
            return project.created_by !== userId;
        });
        return sharedWithMe;
    }
};
interface ExtendedEmbeddedImage extends shapes.standard.EmbeddedImage {
    uuid?: string;
}
const returnCurrentTransformersIcon = (icon: string) => {
    const location = window.location.host;
    if (location === 'localhost:4200') {
        return `/v3-dms/assets/icon/transformersIcons/${icon}`;
    } else {
        return `/assets/icon/transformersIcons/${icon}`;
    }
};
export const getStencilMarkup = (currentObj: any, stencilBg: any, stencilStroke: any, icon: any, uuid: any) => {
    const stencilMarkup: ExtendedEmbeddedImage = new shapes.standard.EmbeddedImage({
        size: { width: 257, height: 52 },
        attrs: {
            idOfTransformer: currentObj?.id,
            root: {
                dataTooltip: currentObj?.name,
                dataTooltipPosition: 'left',
                dataTooltipPositionSelector: '.joint-stencil'
            },
            body: {
                rx: 2,
                ry: 2,
                fill: stencilBg,
                stroke: stencilStroke || '#000000',
                strokeWidth: 1,
                strokeDasharray: '0'
            },
            label: {
                text: getTruncatedText(currentObj?.name, 24),
                fill: '#08192E',
                fontFamily: 'IBM Plex Sans',
                fontWeight: '600',
                fontSize: 14,
                strokeWidth: 1,
                x: -48,
                y: 6
            },
            image: {
                width: 35,
                height: 35,
                x: -13,
                y: 10,
                href: returnCurrentTransformersIcon(icon)
            }
        },
        ports: {
            groups: {
                in: {
                    markup: [
                        {
                            tagName: 'circle',
                            selector: 'portBody',
                            attributes: {
                                r: 5
                            }
                        }
                    ],
                    attrs: {
                        portBody: {
                            magnet: true,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            strokeWidth: 1
                        },
                        portLabel: {
                            fontSize: 11,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            fontWeight: 800
                        }
                    },
                    position: {
                        name: 'left'
                    },
                    label: {
                        position: {
                            name: 'left',
                            args: {
                                y: 0
                            }
                        }
                    }
                },
                inPoly2: {
                    markup: `<polygon cursor="pointer" class="port-body" points="-7,0 -4.0,-7 4.0,-7 7,0 4.0,7 -4.0,7" fill='#FFFFFF' stroke="${stencilStroke}" />`,
                    attrs: {
                        portBody: {
                            magnet: true,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            strokeWidth: 1
                        },
                        portLabel: {
                            fontSize: 11,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            fontWeight: 800
                        }
                    },
                    position: {
                        name: 'left'
                    },
                    label: {
                        position: {
                            name: 'left',
                            args: {
                                y: 0
                            }
                        }
                    }
                },
                inPoly: {
                    markup: `<polygon cursor="pointer" className="port-body" cy='20' points="0,-7, 7,7, -7,7" fill="#FFFFFF" stroke="${stencilStroke}" />`,
                    attrs: {
                        portBody: {
                            magnet: true,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            strokeWidth: 1
                        },
                        portLabel: {
                            fontSize: 11,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            fontWeight: 800
                        }
                    },
                    position: {
                        name: 'left'
                    },
                    label: {
                        position: {
                            name: 'left',
                            args: {
                                y: 0
                            }
                        }
                    }
                },
                inRect: {
                    markup: `<rect cursor="pointer" class="port-body" x="-7" y="-7" width="10" height="10" fill="#FFFFFF" stroke="${stencilStroke}" />`,
                    attrs: {
                        portBody: {
                            magnet: true,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            strokeWidth: 1
                        },
                        portLabel: {
                            fontSize: 11,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            fontWeight: 800
                        }
                    },
                    position: {
                        name: 'left'
                    },
                    label: {
                        position: {
                            name: 'left',
                            args: {
                                y: 0
                            }
                        }
                    }
                },
                out: {
                    markup: [
                        {
                            tagName: 'circle',
                            selector: 'portBody',
                            attributes: {
                                r: 5
                            }
                        }
                    ],
                    position: {
                        name: 'right'
                    },
                    attrs: {
                        portBody: {
                            magnet: true,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            strokeWidth: 1
                        },
                        portLabel: {
                            fontSize: 11,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            fontWeight: 800
                        }
                    },
                    label: {
                        position: {
                            name: 'right',
                            args: {
                                y: 0
                            }
                        }
                    }
                },
                outRect: {
                    markup: `<rect cursor="pointer" class="port-body" x="-7" y="-7" width="10" height="10" fill="#FFFFFF" stroke="${stencilStroke}" />`,
                    attrs: {
                        portBody: {
                            magnet: true,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            strokeWidth: 1
                        },
                        portLabel: {
                            fontSize: 11,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            fontWeight: 800
                        }
                    },
                    position: {
                        name: 'right'
                    },
                    label: {
                        position: {
                            name: 'right',
                            args: {
                                y: 0
                            }
                        }
                    }
                },
                outPoly2: {
                    markup: `<polygon cursor="pointer" class="port-body" points="-7,0 -4.0,-7 4.0,-7 7,0 4.0,7 -4.0,7" fill='#FFFFFF' stroke="${stencilStroke}" />`,
                    attrs: {
                        portBody: {
                            magnet: true,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            strokeWidth: 1
                        },
                        portLabel: {
                            fontSize: 11,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            fontWeight: 800
                        }
                    },
                    position: {
                        name: 'right'
                    },
                    label: {
                        position: {
                            name: 'right',
                            args: {
                                y: 0
                            }
                        }
                    }
                },
                outPoly: {
                    markup: `<polygon cursor="pointer" className="port-body" cy='20' points="0,-7, 7,7, -7,7" fill="#FFFFFF" stroke="${stencilStroke}" />`,
                    attrs: {
                        portBody: {
                            magnet: true,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            strokeWidth: 1
                        },
                        portLabel: {
                            fontSize: 11,
                            fill: '#FFFFFF',
                            stroke: stencilStroke || '#000000',
                            fontWeight: 800
                        }
                    },
                    position: {
                        name: 'right'
                    },
                    label: {
                        position: {
                            name: 'right',
                            args: {
                                y: 0
                            }
                        }
                    }
                }
            }
        }
    });
    stencilMarkup.uuid = uuid;
    let inputPorts = [];
    let outputPorts = [];
    if (currentObj?.inputs?.length > 0) {
        inputPorts = currentObj?.inputs.map((input: any) => {
            let typeOfPort = 'in';
            if (input?.type === 'DATAFRAME') {
                typeOfPort = 'inRect';
            } else if (input?.type === 'DATASET') {
                typeOfPort = 'in';
            } else if (input?.type === 'MODEL') {
                typeOfPort = 'inPoly';
            } else if (input?.type === 'METADATA') {
                typeOfPort = 'inPoly2';
            } else {
                typeOfPort = 'in';
            }
            return {
                group: typeOfPort,
                id: input?.id,
                isRequired: input?.isRequired || null,
                isExported: input?.isExported || null,
                type: input?.type || null,
                attrs: {
                    label: {
                        text: input?.name
                    }
                }
            };
        });
    }
    if (currentObj?.outputs?.length > 0) {
        outputPorts = currentObj?.outputs.map((output: any) => {
            let typeOfPort = 'out';
            if (output?.type === 'DATAFRAME') {
                typeOfPort = 'outRect';
            } else if (output?.type === 'DATASET') {
                typeOfPort = 'out';
            } else if (output?.type === 'MODEL') {
                typeOfPort = 'outPoly';
            } else if (output?.type === 'METADATA') {
                typeOfPort = 'outPoly2';
            } else {
                typeOfPort = 'out';
            }
            return {
                group: typeOfPort,
                id: output?.id,
                isRequired: output?.isRequired || null,
                isExported: output?.isExported || null,
                type: output?.type || null,
                attrs: {
                    label: {
                        text: output?.name
                    }
                }
            };
        });
    }
    const combinedGroupPorts = [...inputPorts, ...outputPorts];
    stencilMarkup.attributes.CombinedPorts = combinedGroupPorts;
    return stencilMarkup;
}

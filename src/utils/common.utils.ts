import { AllUsers } from '../models/profile';
import { GetAllProjectsDetail, GetSingleProjectDetail } from '../models/project';
import moment from 'moment';

export const getProjectAccessList = (projectList: any, selectedProject: string) => {
    if(selectedProject === "") {
        return projectList[0].project_access;
    } else {
        return projectList.filter((project: any) => {
            return project.id.toString() === selectedProject;
        })[0].project_access;
    }
};
export const getProjectNameAndLabelsForSelect = (projectList: GetAllProjectsDetail[] ) => {
    const projectsName = projectList.map(project => {
        return {
            name: project.name,
            id: project.id
        }
    });
    return projectsName;
};
export const copyToClipBoard = (copyMessage: string, callBack: any) => {
    navigator.clipboard.writeText(copyMessage).then(() => {
            callBack();
    });
};
export const convertTime = (date: any, isLastModifiedNeeded: boolean) => {
    if(isLastModifiedNeeded) {
        return moment.utc(date).local().fromNow();
    } else {
        return moment.utc(date).local().format('MM/DD/YYYY HH:MM A');
    }
};

export const getUserNameFromId = (userData: AllUsers[], userId: string) => {
    console.log('1111', userData, userId);
    const currentUser = userData?.filter((user: AllUsers) => {
        return user.userId === userId;
    });
    const fullName = `${currentUser![0].firstName} ${currentUser![0].lastName}`;
    return fullName;
};

export const getUserNameFromIdInitials = (userData: AllUsers[], userId: string) => {
    const currentUser = userData?.filter((user: AllUsers) => {
        return user.userId === userId;
    });
    const initials = `${currentUser![0].firstName[0]}${currentUser![0].lastName[0]}`;
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

export const getFormattedUserData = (allUserData: AllUsers[], projectData: GetSingleProjectDetail) => {
    const reformattedProjectAccessData = projectData.project_access.map((singleProjectAccess, projectAccessIndex) => {
        const sharedUser = allUserData?.filter((singleUser) => {
            return singleUser.userId === singleProjectAccess.user_id
        });
        return {
            firstName: (sharedUser?.length > 0) ? sharedUser![0].firstName : '',
            lastName: (sharedUser?.length > 0) ? sharedUser![0].lastName: '',
            email: (sharedUser?.length > 0) ? sharedUser![0].email: '',
            accessLevel: (sharedUser?.length > 0) ? projectData.project_access[projectAccessIndex].access_level: ''
        }
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
            (project.project_access.filter((access: any) => {
                   const userFilteredProjectAccess = getUserNameFromIdInitials(AllUsersData, access.user_id);
                   return userFilteredProjectAccess.toLowerCase().match(new RegExp(searchTerm, 'g'))
               }).length > 0) ? true: false
    })
}

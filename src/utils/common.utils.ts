import { AllUsers } from '../models/profile';
import { GetSingleProjectDetail } from '../models/project';

export const convertTime = (date: string) => {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(Date.parse(date));
};

export const getUserNameFromId = (userData: AllUsers[], userId: string) => {
    const currentUser = userData?.filter((user: AllUsers) => {
        return user.userId === userId;
    });
    const fullName = `${currentUser![0].firstName} ${currentUser![0].lastName}`;
    return fullName;
};

export const getTruncatedText = (name: string) => {
    const maxTextCharacters = 20;
    if (name?.length >= 20) {
        const newName = `${name.slice(0, maxTextCharacters)}...`;
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
               user.toLowerCase().match(new RegExp(searchTerm, 'g'));
    })
}

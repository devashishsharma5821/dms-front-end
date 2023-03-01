import { AllUsers } from '../models/profile';
import { GetSingleProjectDetail } from '../models/project';

export const getUserNameFromId = (userData:AllUsers[], userId: string) => {
    const currentUser = userData?.filter((user: AllUsers) => {
        return user.userId === userId;
    });
    const fullName = `${currentUser[0].firstName} ${currentUser[0].lastName}`;
    return fullName;
}

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
    const reformattedProjectAccessData = projectData.project_access.map((singleProjectAccess) => {
        const sharedUser = allUserData?.filter((singleUser) => {
            return singleUser.userId === singleProjectAccess.user_id
        });
        return {
            firstName: (sharedUser?.length > 0) ? sharedUser[0].firstName : '',
            lastName: (sharedUser?.length > 0) ? sharedUser[0].lastName: '',
            email: (sharedUser?.length > 0) ? sharedUser[0].email: ''
        }
    });

    return reformattedProjectAccessData;
};

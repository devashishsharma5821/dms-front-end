import { AllUsers } from '../models/profile';

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

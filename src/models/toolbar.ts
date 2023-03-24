import { DmsComputeData } from './computeDetails';
import { Experiment } from './experimentModel';
import { GetSingleProjectDetail } from './project';
import { AllUsers } from './profile';

export interface toolbarPropsType {
    computeData: DmsComputeData[];
    experimentData: Experiment;
    projectData: GetSingleProjectDetail;
    usersData: AllUsers;
    userAccessList: any;
    is_default: boolean | undefined;
}

/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const IsRequired: React.FC<LogoProps> = () => {
    return (
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.60398 3.91515L3.93745 3L5.60398 2.08485C5.7422 2.00895 5.79102 1.83425 5.71216 1.6977L5.48388 1.30229C5.40504 1.16573 5.22935 1.12066 5.0945 1.20241L3.4687 2.1881L3.50942 0.287273C3.5128 0.129621 3.38593 0 3.22823 0H2.77167C2.61398 0 2.4871 0.129621 2.49049 0.287273L2.5312 2.1881L0.905401 1.20243C0.770565 1.12068 0.594866 1.16575 0.516022 1.3023L0.287741 1.69771C0.208897 1.83427 0.257717 2.00896 0.39594 2.08486L2.06245 3L0.395928 3.91515C0.257706 3.99105 0.208885 4.16575 0.287741 4.3023L0.516022 4.69771C0.594866 4.83427 0.770565 4.87934 0.905401 4.79759L2.5312 3.8119L2.49048 5.71273C2.4871 5.87038 2.61398 6 2.77167 6H3.22824C3.38593 6 3.51281 5.87038 3.50944 5.71273L3.4687 3.8119L5.0945 4.79757C5.22934 4.87932 5.40504 4.83425 5.48388 4.6977L5.71216 4.30229C5.79101 4.16573 5.7422 3.99105 5.60398 3.91515V3.91515Z"
                fill="#F56565"
            />
        </svg>
    );
};

export default IsRequired;

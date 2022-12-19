/* eslint-disable max-len */
import React from 'react';

type LogoProps = {
    children?: never;
};

export const WideCreateIcon: React.FC<LogoProps> = () => {
    return (
        <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="39.6398" rx="19.8199" fill="#416F8E"/>
        <path d="M28 18.7143V21.2857H20.2857V29H17.7143V21.2857H10V18.7143H17.7143V11H20.2857V18.7143H28Z" fill="white"/>
        <path d="M44.272 24.9478C43.184 24.9478 42.2347 24.7132 41.424 24.2438C40.624 23.7745 40.0053 23.1078 39.568 22.2438C39.1413 21.3692 38.928 20.3452 38.928 19.1718C38.928 17.9985 39.1413 16.9798 39.568 16.1158C40.0053 15.2412 40.624 14.5745 41.424 14.1158C42.2347 13.6465 43.184 13.4118 44.272 13.4118C45.04 13.4118 45.7547 13.5345 46.416 13.7798C47.0773 14.0145 47.6373 14.3558 48.096 14.8038L47.52 16.0198C46.9973 15.5825 46.4747 15.2678 45.952 15.0758C45.44 14.8838 44.8853 14.7878 44.288 14.7878C43.1147 14.7878 42.208 15.1665 41.568 15.9238C40.9387 16.6812 40.624 17.7638 40.624 19.1718C40.624 20.5798 40.9387 21.6678 41.568 22.4358C42.208 23.1932 43.1147 23.5718 44.288 23.5718C44.8853 23.5718 45.44 23.4758 45.952 23.2838C46.4747 23.0918 46.9973 22.7772 47.52 22.3398L48.096 23.5558C47.6373 24.0038 47.0773 24.3505 46.416 24.5958C45.7547 24.8305 45.04 24.9478 44.272 24.9478ZM54.9001 18.1798L53.9241 18.2758C53.1561 18.3505 52.6015 18.5852 52.2601 18.9798C51.9295 19.3745 51.7641 19.8758 51.7641 20.4838V24.8198H50.1481V17.0118H51.7161V18.3718C52.1321 17.4545 52.9801 16.9478 54.2601 16.8518L54.7881 16.8198L54.9001 18.1798ZM62.7393 21.1878H57.2192C57.3366 22.8412 58.1579 23.6678 59.6832 23.6678C60.5792 23.6678 61.3899 23.3745 62.1153 22.7878L62.6112 23.9238C62.2486 24.2332 61.8006 24.4785 61.2673 24.6598C60.7339 24.8412 60.1899 24.9318 59.6352 24.9318C58.3872 24.9318 57.4006 24.5745 56.6752 23.8598C55.9606 23.1452 55.6032 22.1585 55.6032 20.8998C55.6032 20.0998 55.7579 19.3905 56.0672 18.7718C56.3872 18.1532 56.8299 17.6732 57.3952 17.3318C57.9712 16.9905 58.6219 16.8198 59.3472 16.8198C60.4033 16.8198 61.2299 17.1612 61.8273 17.8438C62.4353 18.5265 62.7393 19.4705 62.7393 20.6758V21.1878ZM59.3793 18.0038C58.7606 18.0038 58.2646 18.2012 57.8912 18.5958C57.5286 18.9798 57.3099 19.5345 57.2352 20.2598H61.3472C61.3153 19.5345 61.1286 18.9798 60.7873 18.5958C60.4566 18.2012 59.9872 18.0038 59.3793 18.0038ZM67.984 16.8198C69.0293 16.8198 69.8027 17.0812 70.304 17.6038C70.816 18.1265 71.072 18.9212 71.072 19.9878V24.8198H69.52V23.5238C69.3173 23.9825 69.0133 24.3345 68.608 24.5798C68.2133 24.8145 67.7493 24.9318 67.216 24.9318C66.704 24.9318 66.2347 24.8305 65.808 24.6278C65.3813 24.4145 65.0453 24.1212 64.8 23.7478C64.5653 23.3745 64.448 22.9585 64.448 22.4998C64.448 21.9345 64.592 21.4918 64.88 21.1718C65.1787 20.8412 65.664 20.6065 66.336 20.4678C67.0187 20.3292 67.952 20.2598 69.136 20.2598H69.504V19.7958C69.504 19.1985 69.376 18.7665 69.12 18.4998C68.8747 18.2332 68.4693 18.0998 67.904 18.0998C67.0187 18.0998 66.1333 18.3718 65.248 18.9158L64.768 17.7798C65.184 17.4918 65.6853 17.2625 66.272 17.0918C66.8693 16.9105 67.44 16.8198 67.984 16.8198ZM67.504 23.7318C68.0907 23.7318 68.5707 23.5345 68.944 23.1398C69.3173 22.7345 69.504 22.2172 69.504 21.5878V21.1718H69.216C68.384 21.1718 67.744 21.2092 67.296 21.2838C66.848 21.3585 66.528 21.4865 66.336 21.6678C66.144 21.8385 66.048 22.0892 66.048 22.4198C66.048 22.7932 66.1813 23.1078 66.448 23.3638C66.7253 23.6092 67.0773 23.7318 67.504 23.7318ZM77.1785 23.6838C77.4238 23.6838 77.6638 23.6678 77.8985 23.6358L77.8185 24.8678C77.5518 24.9105 77.2745 24.9318 76.9865 24.9318C75.9732 24.9318 75.2158 24.6865 74.7145 24.1958C74.2238 23.6945 73.9785 22.9745 73.9785 22.0358V18.2598H72.4585V17.0118H73.9785V14.6598H75.5945V17.0118H77.7385V18.2598H75.5945V21.9718C75.5945 23.1132 76.1225 23.6838 77.1785 23.6838ZM86.0111 21.1878H80.4911C80.6085 22.8412 81.4298 23.6678 82.9551 23.6678C83.8511 23.6678 84.6618 23.3745 85.3871 22.7878L85.8831 23.9238C85.5205 24.2332 85.0725 24.4785 84.5391 24.6598C84.0058 24.8412 83.4618 24.9318 82.9071 24.9318C81.6591 24.9318 80.6725 24.5745 79.9471 23.8598C79.2325 23.1452 78.8751 22.1585 78.8751 20.8998C78.8751 20.0998 79.0298 19.3905 79.3391 18.7718C79.6591 18.1532 80.1018 17.6732 80.6671 17.3318C81.2431 16.9905 81.8938 16.8198 82.6191 16.8198C83.6751 16.8198 84.5018 17.1612 85.0991 17.8438C85.7071 18.5265 86.0111 19.4705 86.0111 20.6758V21.1878ZM82.6511 18.0038C82.0325 18.0038 81.5365 18.2012 81.1631 18.5958C80.8005 18.9798 80.5818 19.5345 80.5071 20.2598H84.6191C84.5871 19.5345 84.4005 18.9798 84.0591 18.5958C83.7285 18.2012 83.2591 18.0038 82.6511 18.0038ZM100.315 13.5398H101.867V24.8198H100.603L94.1546 16.3078V24.8198H92.6026V13.5398H93.8506L100.315 22.0678V13.5398ZM111.189 21.1878H105.669C105.787 22.8412 106.608 23.6678 108.133 23.6678C109.029 23.6678 109.84 23.3745 110.565 22.7878L111.061 23.9238C110.699 24.2332 110.251 24.4785 109.717 24.6598C109.184 24.8412 108.64 24.9318 108.085 24.9318C106.837 24.9318 105.851 24.5745 105.125 23.8598C104.411 23.1452 104.053 22.1585 104.053 20.8998C104.053 20.0998 104.208 19.3905 104.517 18.7718C104.837 18.1532 105.28 17.6732 105.845 17.3318C106.421 16.9905 107.072 16.8198 107.797 16.8198C108.853 16.8198 109.68 17.1612 110.277 17.8438C110.885 18.5265 111.189 19.4705 111.189 20.6758V21.1878ZM107.829 18.0038C107.211 18.0038 106.715 18.2012 106.341 18.5958C105.979 18.9798 105.76 19.5345 105.685 20.2598H109.797C109.765 19.5345 109.579 18.9798 109.237 18.5958C108.907 18.2012 108.437 18.0038 107.829 18.0038ZM123.637 17.0118H125.237L122.245 24.8198H120.789L118.725 19.2358L116.661 24.8198H115.189L112.213 17.0118H113.893L116.005 22.8838L118.133 17.0118H119.397L121.525 22.9158L123.637 17.0118Z" fill="white"/>
        </svg>
        
    );
};

export default WideCreateIcon;
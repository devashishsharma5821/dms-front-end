import React, { ChangeEvent, useState } from 'react';
import { useColorModeValue, InputGroup, Input, InputLeftElement, InputRightElement, IconButton } from '@chakra-ui/react';
import { CloseIcon, Search2Icon } from '@chakra-ui/icons';

const SearchComponent = (props:any) => {
    const [showClearSearch, setClearSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const iconBg = useColorModeValue('light.lighterGrayishBlue', 'dark.veryDarkGrayishBlue');

/* 
* for Handling Search Input Changes
*/

    const searchChange = (event: ChangeEvent<HTMLInputElement>) => {
        let currentSearchValue = event.currentTarget.value;
        setSearchValue(event.currentTarget.value);
        currentSearchValue && currentSearchValue.trim() != '' ? setClearSearch(true) : setClearSearch(false);
        props.searchChange(currentSearchValue);
    };

/* 
* for Clearing Search Input Changes
*/

    const clearSearch = () => {
        setSearchValue('');
        setClearSearch(false);
        props.searchChange("");
    };

    return (
        <InputGroup
            size="sm"
            w="275"
            bg={useColorModeValue('default.whiteText', 'dark.mediumDark')}
            borderRadius="4px"
            border="1px"
            borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryDarkGrayishBlue')}
            _focus={{ outline: 'none', boxShadow: 'none' }}
        >
            <InputLeftElement width="var(--chakra-sizes-10)" pointerEvents="none" children={<Search2Icon color="default.darkGray" />} />
            <Input
                placeholder="Search"
                _placeholder={{ color: 'default.gray' }}
                value={searchValue}
                border="none"
                paddingStart="38"
                paddingEnd="25px"
                _focus={{ outline: 'none', boxShadow: 'none' }}
                onChange={searchChange}
            />
            {showClearSearch ? (
                <InputRightElement width="4.5rem" justifyContent="flex-end">
                    <IconButton
                        aria-label="Search database"
                        icon={<CloseIcon onClick={clearSearch} color="default.darkGray" />}
                        bg="transparent"
                        color={iconBg}
                        _hover={{ background: 'transparent' }}
                    />
                </InputRightElement>
            ) : (
                ''
            )}
        </InputGroup>
    );
};

export default SearchComponent;

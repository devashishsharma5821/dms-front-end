import { useState } from 'react';
import './home.scss';
import { Button, Wrap, WrapItem, Tooltip, useToast, useColorModeValue, Box } from '@chakra-ui/react';
import ModalComponent from '../../component/modalSystem/modal';
import {
    MultiSelect,
    MultiSelectProps,
    MultiSelectTheme,
    SelectionVisibilityMode,
    useMultiSelect,
} from 'chakra-multiselect';
const HomePage = () => {
    const [message, setMessage] = useState('Status');
    const toast = useToast();
    const statuses = ['success', 'error', 'warning', 'info'];
    const [value, setValue] = useState([]);
    // useEffect(() => {
    //     wsconnect(setMessage);
    // }, []);
    const items = [
        'Neptunium',
        'Plutonium',
        'Americium',
        'Curium',
        'Berkelium',
        'Californium',
        'Einsteinium',
        'Fermium',
        'Mendelevium',
        'Nobelium',
        'Lawrencium',
        'Rutherfordium',
        'Dubnium',
        'Seaborgium',
        'Bohrium',
        'Hassium',
        'Meitnerium',
        'Darmstadtium',
        'Roentgenium',
        'Copernicium',
        'Nihonium',
        'Flerovium',
        'Moscovium',
        'Livermorium',
        'Tennessine',
        'Oganesson',
    ]

    const _options = items.map((label) => ({ label, value: label.toLowerCase() }));

    const onChange = (ev: any) => {
        setValue(ev);
    }
    return (
        <>
            <div className="wrap">
                <Wrap ml={54} mt={10}>
                    {statuses.map((status: any, i: number) => (
                        <WrapItem key={i}>
                            <Button
                                variant="solid"
                                bg={'light.button'}
                                onClick={() =>
                                    toast({
                                        title: `${status} toast`,
                                        status: status,
                                        isClosable: true,
                                        position: 'top-right'
                                    })
                                }
                            >
                                Show {status} toast
                            </Button>
                        </WrapItem>
                    ))}
                    <WrapItem key={'modal'}>
                        <ModalComponent />
                    </WrapItem>
                    <WrapItem>
                        <Tooltip hasArrow label="Tooltip Example">
                            <Button variant="solid" bg={useColorModeValue('light.button', 'dark.button')}>
                                ToolTip Example
                            </Button>
                        </Tooltip>
                    </WrapItem>

                </Wrap>
            </div>
            <Box h={'400px'} width={'500px'} ml={'350px'}>
                <MultiSelect
                    value={value}
                    options={_options}
                    label='Example of Tag Creation'
                    onChange={onChange!}
                    create
                />
            </Box>

        </>
    );
};

export default HomePage;

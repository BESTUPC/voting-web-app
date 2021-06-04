import 'animate.css';
import React, { CSSProperties, FunctionComponent } from 'react';
import { Button, ButtonGroup, FormControl, InputGroup, ToggleButton } from 'react-bootstrap';
import { BsPlusCircle, BsXCircle } from 'react-icons/bs';
import { animate } from '../../utils/Animate';
import './PollOption.css';

interface PollOptionProps {
    name: string;
    disabled: boolean;
    isAbstention: boolean;
    isAgainst: boolean;
    handleButton: (e: React.MouseEvent<HTMLElement>) => void;

    handleClick: (e: React.MouseEvent<HTMLElement>, value: string) => void;
    handleWrite: (e: React.ChangeEvent<any>) => void;
    idx: number;
    fixed: boolean;
    selected: boolean;
    style?: CSSProperties;
}

export const PollOption: FunctionComponent<PollOptionProps> = ({
    name,
    disabled,
    isAbstention,
    isAgainst,
    handleButton,
    handleClick,
    handleWrite,
    idx,
    fixed,
    selected,
    style
}) => {
    const handleButtonAux = (e: React.MouseEvent<HTMLElement>): void => {
        if (!name) {
            animate(`.my-element-${idx}`, 'shakeX');
            return;
        }
        handleButton(e);
    };
    return (
        <InputGroup className={`my-element-${idx}`} style={style}>
            {!fixed && (
                <InputGroup.Prepend>
                    <Button
                        variant="outline-secondary"
                        onClick={(e) => handleButtonAux(e)}
                        style={{ zIndex: 1 }}
                        disabled={fixed}
                    >
                        {disabled ? <BsXCircle></BsXCircle> : <BsPlusCircle></BsPlusCircle>}
                    </Button>
                </InputGroup.Prepend>
            )}
            <FormControl disabled={disabled} value={name} onChange={(e) => handleWrite(e)} />
            <InputGroup.Append>
                <ButtonGroup toggle>
                    {(!fixed || isAgainst) && (
                        <ToggleButton
                            type="radio"
                            variant="outline-secondary"
                            id="optionButton"
                            value={'Blanc'}
                            checked={isAgainst}
                            onClick={(e) => handleClick(e, 'Blanc')}
                            style={{
                                borderTopLeftRadius: '0px',
                                borderBottomLeftRadius: '0px',
                                zIndex: 1,
                                color: selected ? 'white' : undefined,
                            }}
                            disabled={fixed}
                        >
                            Blanc
                        </ToggleButton>
                    )}
                    {(!fixed || isAbstention) && (
                        <ToggleButton
                            type="radio"
                            variant="outline-secondary"
                            id="optionButton"
                            value={'Abstenció'}
                            checked={isAbstention}
                            onClick={(e) => handleClick(e, 'Abstenció')}
                            style={{
                                borderTopLeftRadius: '0px',
                                borderBottomLeftRadius: '0px',
                                zIndex: 1,
                                color: selected ? 'white' : undefined,
                            }}
                            disabled={fixed}
                        >
                            Abstenció
                        </ToggleButton>
                    )}
                </ButtonGroup>
            </InputGroup.Append>
        </InputGroup>
    );
};

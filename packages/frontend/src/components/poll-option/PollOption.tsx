import React, { FunctionComponent, useState } from 'react';
import { Button, ButtonGroup, FormControl, InputGroup, ToggleButton } from 'react-bootstrap';
import { BsPlusCircle, BsXCircle } from 'react-icons/bs';
import 'animate.css';
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
}
export const CheckOptions = ['BLANC', 'ABSTENCIO'];

export const PollOption: FunctionComponent<PollOptionProps> = ({
    name,
    disabled,
    isAbstention,
    isAgainst,
    handleButton,
    handleClick,
    handleWrite,
    idx,
}) => {
    const radioValue = isAbstention ? 'ABSTENCIO' : isAgainst ? 'BLANC' : 'NONE';

    const handleButtonAux = (e: React.MouseEvent<HTMLElement>): void => {
        if (!name) {
            const element = document.querySelector(`.my-element-${idx}`);
            element!.classList.add('animate__animated', 'animate__shakeX');
            return;
        }
        handleButton(e);
    };
    return (
        <InputGroup className={`my-element-${idx}`}>
            <Button variant="outline-secondary" onClick={(e) => handleButtonAux(e)}>
                {disabled ? <BsXCircle></BsXCircle> : <BsPlusCircle></BsPlusCircle>}
            </Button>
            <FormControl disabled={disabled} value={name} onChange={(e) => handleWrite(e)} />
            <ButtonGroup toggle>
                {CheckOptions.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        type="radio"
                        variant="outline-secondary"
                        id="optionButton"
                        value={radio}
                        checked={radioValue === radio}
                        onClick={(e) => handleClick(e, radio)}
                    >
                        {radio}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </InputGroup>
    );
};

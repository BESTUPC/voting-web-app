import { EMembership, EPollApprovalRatio, IPollOption } from 'interfaces';
import React, { forwardRef, FunctionComponent, useState } from 'react';
import { Button, Col, Form, InputGroup, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PollOption } from '../../components/poll-option/PollOption';
import { BaseScreen } from '../base-screen/BaseScreen';
import './CreatePollScreen.css';

export const CreatePollScreen: FunctionComponent = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [isPrivate, setIsPrivate] = useState(false);
    const [isPriority, setIsPriority] = useState(false);
    const [validAbstention, setValidAbstention] = useState(false);
    const [target, setTarget] = useState(EMembership.ALL);
    const [approval, setApproval] = useState(EPollApprovalRatio.SIMPLE);
    const [options, setOptions] = useState([
        { name: 'Blanc', isAgainst: true, isAbstention: false, disabled: true },
        { name: 'Abstenció', isAgainst: false, isAbstention: true, disabled: true },
        { name: '', isAgainst: false, isAbstention: false, disabled: false },
    ] as (IPollOption & { disabled: boolean })[]);

    const handleClick = (e: React.MouseEvent<HTMLElement>, value: string, idx: number): void => {
        e.preventDefault();
        const optionsUpdated = options;
        const option = optionsUpdated[idx];
        const radioValue = option.isAbstention ? 'ABSTENCIO' : option.isAgainst ? 'BLANC' : 'NONE';
        if (radioValue === value) {
            option.isAbstention = false;
            option.isAgainst = false;
            optionsUpdated[idx] = option;
            setOptions([...optionsUpdated]);
        } else {
            if (value === 'BLANC') {
                option.isAgainst = true;
                option.isAbstention = false;
            } else {
                option.isAgainst = false;
                option.isAbstention = true;
            }
            optionsUpdated[idx] = option;
            setOptions([...optionsUpdated]);
        }
    };

    const handleWrite = (e: React.ChangeEvent<HTMLFormElement>, idx: number): void => {
        const optionsUpdated = options;
        optionsUpdated[idx].name = e.target.value;
        setOptions([...optionsUpdated]);
    };

    const handleButton = (e: React.MouseEvent<HTMLElement>, idx: number): void => {
        e.preventDefault();

        const optionsUpdated = options;
        if (optionsUpdated[idx].disabled) {
            optionsUpdated.splice(idx, 1);
        } else {
            optionsUpdated[idx].disabled = true;
            optionsUpdated.push({
                name: '',
                isAgainst: false,
                isAbstention: false,
                disabled: false,
            });
        }
        setOptions([...optionsUpdated]);
    };

    return (
        <BaseScreen>
            <Form className="mt-5">
                <Form.Group id="formText">
                    <Form.Control size="lg" type="title" placeholder="Poll title" />
                    <br />
                    <Form.Control as="textarea" rows={3} placeholder="Poll description" />
                </Form.Group>
                <Form.Group id="formSelections">
                    <Form.Row>
                        <Col>
                            <Form.Group>
                                {options.map((o, idx) => (
                                    <Form.Group key={idx}>
                                        <PollOption
                                            key={idx}
                                            name={o.name}
                                            disabled={o.disabled}
                                            isAbstention={o.isAbstention}
                                            isAgainst={o.isAgainst}
                                            handleClick={(e, v) => handleClick(e, v, idx)}
                                            handleButton={(e) => handleButton(e, idx)}
                                            handleWrite={(e) => handleWrite(e, idx)}
                                            idx={idx}
                                        ></PollOption>
                                    </Form.Group>
                                ))}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Append>
                                            <InputGroup.Text>Target</InputGroup.Text>
                                        </InputGroup.Append>
                                        <Form.Control
                                            as="select"
                                            onChange={(c) => {
                                                setTarget(
                                                    c.currentTarget.value.toUpperCase() as EMembership,
                                                );
                                            }}
                                        >
                                            <option>{EMembership.ALL.toLowerCase()}</option>
                                            <option>{EMembership.MEMBER.toLowerCase()}</option>
                                            <option>{EMembership.FULL.toLowerCase()}</option>
                                        </Form.Control>
                                    </InputGroup>
                                </Form.Group>
                                <InputGroup>
                                    <InputGroup.Append>
                                        <InputGroup.Text>Approval</InputGroup.Text>
                                    </InputGroup.Append>
                                    <Form.Control
                                        as="select"
                                        onChange={(c) => {
                                            setApproval(
                                                c.currentTarget.value.toUpperCase() as EPollApprovalRatio,
                                            );
                                        }}
                                    >
                                        <option>{EPollApprovalRatio.SIMPLE.toLowerCase()}</option>
                                        <option>{EPollApprovalRatio.ABSOLUTE.toLowerCase()}</option>
                                        <option>
                                            {EPollApprovalRatio.TWO_THIRDS.toLowerCase().replace(
                                                '_',
                                                ' ',
                                            )}
                                        </option>
                                    </Form.Control>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group>
                                <ToggleButtonGroup type="checkbox" style={{ width: '100%' }}>
                                    <ToggleButton
                                        type="checkbox"
                                        variant="outline-secondary"
                                        name="radio"
                                        checked={isPrivate}
                                        value="1"
                                        onChange={(e) => setIsPrivate(e.currentTarget.checked)}
                                    >
                                        Private
                                    </ToggleButton>
                                    <ToggleButton
                                        type="checkbox"
                                        variant="outline-secondary"
                                        name="radio"
                                        checked={isPriority}
                                        value="2"
                                        onChange={(e) => setIsPriority(e.currentTarget.checked)}
                                    >
                                        Priority
                                    </ToggleButton>
                                    <ToggleButton
                                        type="checkbox"
                                        variant="outline-secondary"
                                        name="radio"
                                        checked={validAbstention}
                                        value="3"
                                        onChange={(e) =>
                                            setValidAbstention(e.currentTarget.checked)
                                        }
                                    >
                                        Valid Abstention
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Form.Group>
                            <Form.Group style={{ display: 'block', width: '100%' }}>
                                <DatePicker
                                    selected={startDate}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    onChange={(date) => !!date && setStartDate(date as Date)}
                                />
                            </Form.Group>
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </BaseScreen>
    );
};

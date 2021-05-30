import es from 'date-fns/locale/es';
import {
    CreatePollBody,
    EMembership,
    EPollApprovalRatio,
    EPollState,
    IPollOption,
} from 'interfaces';
import React, { FunctionComponent, useState } from 'react';
import { Button, Col, Form, InputGroup, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Redirect } from 'react-router-dom';
import { CustomModal } from '../../components/custom-modal/CustomModal';
import { PollOption } from '../../components/poll-option/PollOption';
import { animate } from '../../utils/Animate';
import { apiService } from '../../utils/ApiService';
import { BaseScreen } from '../base-screen/BaseScreen';
import './CreatePollScreen.css';
registerLocale('es', es);

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
    const [modalShown, setModalShown] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalText, setModalText] = useState<string>('');
    const [goHome, setGoHome] = useState<boolean>(false);

    function handleModal() {
        setModalShown(!modalShown);
        if (modalTitle === 'Success') {
            setGoHome(true);
        }
    }

    const handleCreate = (): void => {
        const title = document.querySelector(`#title`) as HTMLInputElement;
        if (!title?.value) {
            animate('#title', 'shakeX');
            return;
        }
        const pollName = title.value;
        const descriptionElem = document.querySelector(`#description`) as HTMLInputElement;
        if (!descriptionElem?.value) {
            animate('#description', 'shakeX');
            return;
        }
        const description = descriptionElem.value;
        if (options.length < 3) {
            animate('#options', 'shakeX');
            return;
        }
        const body: CreatePollBody = {
            pollName,
            description,
            isPriority,
            isPrivate,
            state: EPollState.OPEN,
            targetGroup: target,
            pollOptions: options.filter((o) => o.disabled),
            approvalRatio: approval,
            abstentionIsValid: validAbstention,
            pollDeadline: startDate.getMilliseconds(),
        };
        apiService
            .createPoll(body)
            .then((response: boolean) => {
                if (response) {
                    setModalTitle('Success');
                    setModalText('Poll created');
                    handleModal();
                } else {
                    setModalTitle('Error');
                    setModalText('Could not create poll.');
                    handleModal();
                }
            })
            .catch((err) => {
                setModalTitle('Error');
                setModalText(JSON.stringify(err));
                handleModal();
            });
    };

    const handleClick = (e: React.MouseEvent<HTMLElement>, value: string, idx: number): void => {
        e.preventDefault();
        const optionsUpdated = options;
        const option = optionsUpdated[idx];
        console.log(option);
        console.log(value);
        const radioValue = option.isAbstention ? 'Abstenció' : option.isAgainst ? 'Blanc' : 'NONE';
        console.log(radioValue);
        if (radioValue === value) {
            option.isAbstention = false;
            option.isAgainst = false;
            optionsUpdated[idx] = option;
            setOptions([...optionsUpdated]);
        } else {
            if (value === 'Blanc') {
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

    return goHome ? (
        <Redirect to="/" />
    ) : (
        <BaseScreen>
            <Form className="mt-5 mb-5">
                <Form.Group id="formText">
                    <Form.Control size="lg" type="title" id="title" placeholder="Poll title" />
                    <br />
                    <Form.Control
                        as="textarea"
                        rows={3}
                        id="description"
                        placeholder="Poll description"
                    />
                </Form.Group>
                <Form.Group id="formSelections">
                    <Form.Row>
                        <Col className="rounded-borders" id="options">
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
                                            fixed={false}
                                        ></PollOption>
                                    </Form.Group>
                                ))}
                            </Form.Group>
                        </Col>
                        <Col className="rounded-borders">
                            <Form.Group>
                                <Form.Group>
                                    <InputGroup id="titleGroup">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Target</InputGroup.Text>
                                        </InputGroup.Prepend>
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
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Approval</InputGroup.Text>
                                    </InputGroup.Prepend>
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
                                    locale="es"
                                    onChange={(date) => !!date && setStartDate(date as Date)}
                                />
                            </Form.Group>
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Button variant="primary" onClick={handleCreate}>
                    Submit
                </Button>
            </Form>
            <CustomModal
                title={modalTitle}
                body={modalText}
                modalHandler={handleModal}
                show={modalShown}
            ></CustomModal>
        </BaseScreen>
    );
};

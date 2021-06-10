import { EPollApprovalRatio, IPoll } from 'interfaces';
import React, { FunctionComponent } from 'react';
import { Container, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';
import {
    BsArrowUpDown,
    BsFillEnvelopeOpenFill,
    BsFillLockFill,
    BsFillPieChartFill
} from 'react-icons/bs';

const renderTooltip = (props: OverlayInjectedProps, name: string) => (
    <Tooltip id="button-tooltip" {...props}>
        {name}
    </Tooltip>
);

interface PollInfoProps {
    poll: IPoll;
}

export const PollInfo: FunctionComponent<PollInfoProps> = ({ poll }) => {
    return (
        <Form.Group id="formText">
            <Form.Control
                as={Container}
                size="lg"
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                {poll.pollName}
                <div>
                    {!!poll.isPrivate && (
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={(props) => renderTooltip(props, 'Poll is private.')}
                        >
                            <BsFillLockFill
                                size="15"
                                style={{ marginRight: '8px' }}
                            ></BsFillLockFill>
                        </OverlayTrigger>
                    )}
                    {!!poll.isPriority && (
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={(props) => renderTooltip(props, 'Poll is a priority poll.')}
                        >
                            <BsArrowUpDown size="15" style={{ marginRight: '8px' }}></BsArrowUpDown>
                        </OverlayTrigger>
                    )}
                    {!!poll.abstentionIsValid && (
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 50, hide: 100 }}
                            overlay={(props) => renderTooltip(props, 'Abstention is valid.')}
                        >
                            <BsFillEnvelopeOpenFill
                                size="15"
                                style={{ marginRight: '8px' }}
                            ></BsFillEnvelopeOpenFill>
                        </OverlayTrigger>
                    )}
                    {poll.approvalRatio === EPollApprovalRatio.SIMPLE ? (
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 50, hide: 100 }}
                            overlay={(props) => renderTooltip(props, 'Approval is simple.')}
                        >
                            <BsFillPieChartFill
                                size="15"
                                style={{ marginRight: '8px' }}
                            ></BsFillPieChartFill>
                        </OverlayTrigger>
                    ) : poll.approvalRatio === EPollApprovalRatio.ABSOLUTE ? (
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 50, hide: 100 }}
                            overlay={(props) => renderTooltip(props, 'Approval is absolute.')}
                        >
                            <BsFillPieChartFill
                                size="15"
                                style={{ marginRight: '8px' }}
                            ></BsFillPieChartFill>
                        </OverlayTrigger>
                    ) : (
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 50, hide: 100 }}
                            overlay={(props) => renderTooltip(props, 'Approval is two thirds.')}
                        >
                            <BsFillPieChartFill
                                size="15"
                                style={{ marginRight: '8px' }}
                            ></BsFillPieChartFill>
                        </OverlayTrigger>
                    )}
                </div>
            </Form.Control>
            <br />
            <InputGroup>
                <Form.Control
                    size="sm"
                    type="title"
                    placeholder={
                        new Date(poll.pollDeadline).toLocaleDateString() +
                        ' ' +
                        new Date(poll.pollDeadline).toLocaleTimeString()
                    }
                    disabled
                    style={{ backgroundColor: 'white' }}
                />
            </InputGroup>
            <br />

            <Form.Control
                as="textarea"
                rows={3}
                id="description"
                placeholder={poll.description}
                disabled
                style={{ backgroundColor: 'white' }}
            />
        </Form.Group>
    );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const ButtonCustom = ({
    action = "",
    icon = EyeOutlined,
    tooltipTitle = 'ToolTip',
    buttonType = 'primary',
    buttonShape = 'circle',
    buttonClassName,
    onClick,
    danger,
    buttonBg,
}) => {

    const backgroundColor = danger ? 'rgb(243 46 49)' : buttonBg;

    return (
        <Link to={action}>
            <Tooltip title={tooltipTitle}>
                <Button
                    type={buttonType}
                    danger={danger}
                    shape={buttonShape}
                    icon={icon}
                    className={`custom-button-inner ${buttonClassName}`}
                    onClick={onClick}
                    style={{ backgroundColor }}
                />
            </Tooltip>
        </Link>
    );
};

export default ButtonCustom;
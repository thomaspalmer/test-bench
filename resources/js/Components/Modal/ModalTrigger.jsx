import React from 'react';

import {Modal} from 'Services';

export default class ModalTrigger extends React.Component {
    /**
     * @method handleOpenModal
     */
    handleOpenModal = () => {
        Modal.open({
            component: this.props.component,
            props: this.props.props ?? {}
        });
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {children, disabled} = this.props;

        return (
            <div onClick={() => !disabled ? this.handleOpenModal() : false} className={disabled ? 'cursor-default' : 'cursor-pointer'}>
                {children}
            </div>
        )
    }
}

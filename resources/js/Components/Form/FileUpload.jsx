import React from 'react';

import Label from './Label';
import {SecondaryButton} from 'Components/Button';

class FileUpload extends React.Component {
    
    /**
     * @var inputRef
     * @type {null|HTMLInputElement}
     */
    inputRef = null;

    /**
     * @method handleOpenInput
     */
    handleOpenInput = () => {
        this.inputRef.click();
    };

    /**
     * @method render
     * @return {*}
     */
    render () {
        const {containerClassName, label, id, onChange, value, accept, placeholder} = this.props;

        return (
            <div className={containerClassName}>
                {label && (<Label label={label} htmlFor={id} />)}

                <input
                    id={id}
                    onChange={(e) => {
                        onChange(e.target.files.length > 0 ? e.target.files[0] : null);
                    }}
                    ref={ref => this.inputRef = ref}
                    type="file"
                    className="hidden"
                    accept={accept}
                />

                <SecondaryButton
                    text={placeholder ?? "Select file"}
                    onClick={this.handleOpenInput}
                />

                { value &&
                    <p className="mt-4">
                        {value.name}
                    </p>
                }
            </div>
        )
    }
};

export default FileUpload;

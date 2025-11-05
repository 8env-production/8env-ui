import {
    DetailedHTMLProps,
    InputHTMLAttributes,
    ReactNode,
    forwardRef,
    useId,
} from 'react';

import styles from './TextInput.module.css';

type NativeInputProps = DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;

export type TextInputProps = { label: ReactNode } & Omit<
    NativeInputProps,
    'id' | 'className' | 'type' | 'ref'
>;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ label, ...props }, ref) => {
        const id = `${useId()}_name_${props.name}`;

        return (
            <div className={styles.root}>
                {label ? (
                    <label className={styles.label} htmlFor={id}>
                        {label}
                    </label>
                ) : null}

                <input
                    ref={ref}
                    {...props}
                    id={id}
                    className={styles.input}
                    type="text"
                />
            </div>
        );
    }
);

TextInput.displayName = 'TextInput';

export default TextInput;

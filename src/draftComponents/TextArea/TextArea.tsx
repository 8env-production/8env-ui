import {
    ChangeEventHandler,
    DetailedHTMLProps,
    KeyboardEventHandler,
    ReactNode,
    TextareaHTMLAttributes,
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useState,
} from 'react';

import styles from './TextArea.module.css';

type NativeTextAreaProps = DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
>;

export type TextAreaProps = { label: ReactNode; onSubmit?: () => void } & Omit<
    NativeTextAreaProps,
    'id' | 'className' | 'type' | 'ref' | 'onKeyDown'
>;

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, onSubmit = () => {}, onChange = () => {}, ...props }, ref) => {
        const [value, setValue] = useState(props.value || '');

        useEffect(() => {
            setValue(props.value || '');
        }, [props.value]);

        const id = `${useId()}_name_${props.name}`;

        const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> =
            useCallback(
                (event) => {
                    if (event.ctrlKey && event.key === 'Enter') {
                        onSubmit();
                        setValue('');
                    }
                },
                [onSubmit]
            );

        const onChangeHandler: ChangeEventHandler<HTMLTextAreaElement> = (
            event
        ) => {
            onChange(event);
            setValue(event.target.value);
        };

        useEffect(() => {
            const element = document.getElementById(id);

            if (!element) {
                return;
            }

            element.style.height = 'auto';
            element.style.height = `${element.scrollHeight + 16}px`;
        }, [id, value]);

        return (
            <div className={styles.root}>
                {label ? (
                    <label className={styles.label} htmlFor={id}>
                        {label}
                    </label>
                ) : null}

                <textarea
                    ref={ref}
                    {...props}
                    id={id}
                    value={value}
                    className={styles.input}
                    onKeyDown={onKeyDown}
                    onChange={onChangeHandler}
                />
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';

export default TextArea;

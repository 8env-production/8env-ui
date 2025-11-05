import { forwardRef, HTMLAttributes, ReactNode } from 'react';

import cn from 'classnames';

import styles from './Icon.module.css';

export type IconSize = 's' | 'm' | 'l';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  size?: IconSize;
  children: ReactNode;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  const {
    size = 'm',
    className,
    children,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    title,
    'aria-hidden': ariaHiddenProp,
    ...rest
  } = props;

  const hasAccessibleName = Boolean(ariaLabel || ariaLabelledBy || title);
  const ariaHidden = ariaHiddenProp ?? !hasAccessibleName;
  const computedRole = ariaHidden ? undefined : role ?? 'img';

  return (
    <span
      ref={ref}
      className={cn(styles.root, styles[`size_${size}`], className)}
      role={computedRole}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      title={title}
      aria-hidden={ariaHidden}
      data-size={size}
      {...rest}
    >
      {children}
    </span>
  );
});

Icon.displayName = 'Icon';
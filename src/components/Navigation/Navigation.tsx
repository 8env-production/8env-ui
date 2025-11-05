import {
  type CSSProperties,
  Children,
  isValidElement,
  type ReactNode,
  type SVGProps,
  forwardRef,
} from 'react';

import cn from 'classnames';

import styles from './Navigation.module.scss';

const BORDER_PATH =
  'M56 0v29c-.8-1-7-6.1-17.7-8.4L13 15.7A16 16 0 0 1 0 0Z';

export interface NavigationProps {
  className?: string;
  style?: CSSProperties;
  logo?: ReactNode;
  topItems?: ReactNode;
  bottomItems?: ReactNode;
  accent?: ReactNode;
  accentProps?: SVGProps<SVGSVGElement>;
  accentTestId?: string;
  ariaLabel?: string;
}

const DefaultAccent = ({
  accentProps,
  accentTestId,
}: {
  accentProps?: SVGProps<SVGSVGElement>;
  accentTestId?: string;
}) => (
  <svg
    viewBox="0 0 56 29"
    className={cn(styles.bottomAccent, accentProps?.className)}
    aria-hidden="true"
    focusable="false"
    data-testid={accentTestId}
    {...accentProps}
  >
    <path className={styles.accentPath} d={BORDER_PATH} />
  </svg>
);

const renderItems = (items: ReactNode, itemClassName: string) => {
  const elements = Children.toArray(items);
  if (elements.length === 0) {
    return null;
  }

  return elements.map((element, index) => {
    const key =
      isValidElement(element) && element.key != null ? element.key : index;

    return (
      <div key={key} className={itemClassName}>
        {element}
      </div>
    );
  });
};

/**
 * Боковая навигация с настраиваемыми секциями
 *
 * @example
 * ```tsx
 * <Navigation
 *   logo={<Logo />}
 *   topItems={[
 *     <Button key="analytics" view="flat">Analytics</Button>,
 *     <Button key="reports" view="flat">Reports</Button>,
 *   ]}
 *   bottomItems={<UserAvatar name="Alex" />}
 * />
 * ```
 */
export const Navigation = forwardRef<HTMLElement, NavigationProps>((props, ref) => {
  const {
    className,
    style,
    logo,
    topItems,
    bottomItems,
    accent,
    accentProps,
    accentTestId,
    ariaLabel,
  } = props;

  const topRendered = renderItems(topItems, styles.item);
  const bottomRendered = renderItems(bottomItems, styles.bottomItem);

  return (
    <nav
      ref={ref}
      className={cn(styles.root, className)}
      style={style}
      aria-label={ariaLabel}
    >
      {(logo || topRendered) && (
        <div className={styles.top}>
          {logo && <div className={styles.logo}>{logo}</div>}
          {topRendered}
        </div>
      )}

      {(bottomRendered || accent) && (
        <div className={styles.bottom}>
          {accent ?? (
            <DefaultAccent accentProps={accentProps} accentTestId={accentTestId} />
          )}
          <div className={styles.bottomContent}>{bottomRendered}</div>
        </div>
      )}
    </nav>
  );
});

Navigation.displayName = 'Navigation';
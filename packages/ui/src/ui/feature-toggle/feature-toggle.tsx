import { Accordion, Switch } from '@janis.me/ui';
import clsx from 'clsx';

import './feature-toggle.scss';

export type FeatureToggleProps = React.ComponentPropsWithoutRef<typeof Accordion.Root>;
export interface FeatureToggleItemProps extends React.ComponentPropsWithoutRef<typeof Accordion.Item> {
  children: [
    React.ReactElement<FeatureToggleTitleProps>,
    React.ReactElement<FeatureToggleContentProps>, // For Content
  ];
}
export type FeatureToggleTitleProps = React.HTMLAttributes<HTMLDivElement>;
export type FeatureToggleToggleProps = React.ComponentPropsWithoutRef<typeof Switch.Root>;
export type FeatureToggleContentProps = React.HTMLAttributes<HTMLDivElement>;

export function Item({ className, children, ...props }: FeatureToggleItemProps) {
  return (
    <Accordion.Item {...props}>
      {children[0]}
      <Accordion.Content className="komplett__feature-toggle__content" asChild>
        {children[1]}
      </Accordion.Content>
    </Accordion.Item>
  );
}

export function Root({ children, ...props }: FeatureToggleProps) {
  return (
    <Accordion.Root className={clsx('komplett__feature-toggle')} {...props}>
      {children}
    </Accordion.Root>
  );
}

export function Header({ className, children, ...props }: FeatureToggleTitleProps) {
  return (
    <Accordion.Header className="komplett__feature-toggle__header" {...props}>
      {children}
    </Accordion.Header>
  );
}

export function Trigger({ className, children, ...props }: FeatureToggleToggleProps) {
  return (
    <Accordion.Trigger className="komplett__feature-toggle__trigger" asChild>
      <div>
        {children}
        <Switch.Root {...props}>
          <Switch.Thumb />
        </Switch.Root>
      </div>
    </Accordion.Trigger>
  );
}

export function Content({ className, children, ...props }: FeatureToggleContentProps) {
  return (
    <div className={clsx('komplett__feature-toggle__content', className)} {...props}>
      {children}
    </div>
  );
}

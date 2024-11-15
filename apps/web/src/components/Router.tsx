import Link, { LinkProps } from '@mui/material/Link';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { createLink } from '@tanstack/react-router';
import { forwardRef } from 'react';

const LinkComponent = forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkComponent(props, ref) {
    return <Link ref={ref} component="a" {...props} />;
  },
);

export const RouterLink = createLink(LinkComponent);

const IconButtonComponent = forwardRef<HTMLAnchorElement, IconButtonProps>(
  function IconButtonComponent(props, ref) {
    return <IconButton ref={ref} component="a" {...props} />;
  },
);

export const RouterIconButton = createLink(IconButtonComponent);

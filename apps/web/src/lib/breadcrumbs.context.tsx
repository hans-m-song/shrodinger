/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useMemo,
  useState,
} from 'react';
import { RouterLink } from '../components/Router';
import { toTitle } from './string';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

export interface Breadcrumb {
  path: string;
  alias?: ReactElement | string;
  params?: Record<string, unknown>;
}

export interface BreadcrumbsContextValue {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextValue | undefined>(
  undefined,
);

export const useBreadcrumbs = () => {
  const value = useContext(BreadcrumbsContext);
  if (value === undefined) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');
  }

  return value;
};

export const BreadcrumbsProvider = (props: PropsWithChildren) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const value = { breadcrumbs, setBreadcrumbs };

  return (
    <BreadcrumbsContext.Provider value={value}>
      {props.children}
    </BreadcrumbsContext.Provider>
  );
};

export const BreadcrumbsDisplay = () => {
  const { breadcrumbs } = useBreadcrumbs();

  const segments = useMemo(() => {
    const normalised = breadcrumbs.map((crumb, i) => ({
      alias: crumb.alias ?? toTitle(crumb.path),
      path:
        '/' +
        breadcrumbs
          .slice(0, i + 1)
          .map((crumb) => crumb.path)
          .join('/'),
      params: breadcrumbs
        .slice(0, i + 1)
        .reduce((acc, crumb) => ({ ...acc, ...crumb.params }), {}),
    }));

    return normalised;
  }, [breadcrumbs]);

  console.log('PathBreadcrumbs', { breadcrumbs, segments });

  if (segments.length < 1) {
    return null;
  }

  return (
    <Breadcrumbs>
      {segments.map((segment, i) =>
        i === segments.length - 1 ? (
          <Typography key={i}>{segment.alias}</Typography>
        ) : (
          <RouterLink key={i} to={segment.path} params={segment.params}>
            {segment.alias}
          </RouterLink>
        ),
      )}
    </Breadcrumbs>
  );
};

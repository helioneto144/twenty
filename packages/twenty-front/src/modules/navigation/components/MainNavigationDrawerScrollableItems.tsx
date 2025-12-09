import { CurrentWorkspaceMemberFavoritesFolders } from '@/favorites/components/CurrentWorkspaceMemberFavoritesFolders';
import { WorkspaceFavorites } from '@/favorites/components/WorkspaceFavorites';
import { NavigationDrawerOpenedSection } from '@/object-metadata/components/NavigationDrawerOpenedSection';
import { RemoteNavigationDrawerSection } from '@/object-metadata/components/RemoteNavigationDrawerSection';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import styled from '@emotion/styled';
import { IconChartBar } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';

const StyledScrollableItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const MainNavigationDrawerScrollableItems = () => {
  const location = useLocation();

  return (
    <StyledScrollableItemsContainer>
      <NavigationDrawerOpenedSection />
      <CurrentWorkspaceMemberFavoritesFolders />
      <WorkspaceFavorites />
      <RemoteNavigationDrawerSection />
      <NavigationDrawerSection>
        <NavigationDrawerSectionTitle label="Relatórios" />
        <NavigationDrawerItem
          label="Relatórios"
          Icon={IconChartBar}
          to={AppPath.ReportsPage}
          active={location.pathname === AppPath.ReportsPage}
        />
      </NavigationDrawerSection>
    </StyledScrollableItemsContainer>
  );
};

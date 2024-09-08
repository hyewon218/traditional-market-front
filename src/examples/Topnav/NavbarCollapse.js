// 파일명: NavbarCollapse.js

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types';

// @mui material components
import MenuItem from '@mui/material/MenuItem';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';

// Custom styles for the NavbarCollapse
import { navbarItem, navbarText } from './styles/navbarCollapse';

// Material Dashboard 2 React context
import { useMaterialUIController } from '../../context';

function NavbarCollapse({ name, active, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;

  return (
    <MDBox {...rest} sx={(theme) =>
      navbarItem(theme, {
        active,
        transparentSidenav,
        whiteSidenav,
        darkMode,
        sidenavColor,
      })
    }>
      <MenuItem sx={(theme) => navbarText(theme, { miniSidenav, transparentSidenav, active })}>
        {name}
      </MenuItem>
    </MDBox>
  );
}

// Typechecking props for the NavbarCollapse
NavbarCollapse.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default NavbarCollapse;

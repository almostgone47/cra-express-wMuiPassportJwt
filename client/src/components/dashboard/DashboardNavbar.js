import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { styled } from "@mui/system";

import AccountPopover from "./AccountPopover";
import Logo from "../Logo";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  boxShadow: "#eee",
  color: "#222",
}));

const DashboardNavbar = (props) => {
  const { onSidebarMobileOpen, ...other } = props;

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          color="inherit"
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              lg: "none",
            },
          }}
        ></IconButton>
        <RouterLink to="/" style={{ display: "flex", alignItems: "center" }}>
          <Logo
            sx={{
              display: {
                lg: "inline",
                xs: "none",
              },
              height: 40,
              width: 40,
              marginRight: 1,
            }}
          />
          <h1>Savvy</h1>
        </RouterLink>
        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
          }}
        />
        <Box sx={{ ml: 2 }}>
          <AccountPopover />
        </Box>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

DashboardNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func,
};

export default DashboardNavbar;

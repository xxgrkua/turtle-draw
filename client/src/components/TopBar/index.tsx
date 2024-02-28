import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectUserInfo } from "../../features/user";
import "./style.css";

const TopBar: React.FC = function () {
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleLogout = () => {
    dispatch(logout()).catch((error) => {
      console.log(error);
    });
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              fontFamily: [
                "Monaco",
                "Menlo",
                "Ubuntu Mono",
                "Consolas",
                "Source Code Pro",
                "source-code-pro",
                "monospace",
              ].join(", "),
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link
              component={RouterLink}
              to={"/"}
              sx={{
                color: "white",
              }}
            >
              TurtleDraw
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <Link component={RouterLink} to={"/"} sx={{ color: "white" }}>
                {"Editor"}
              </Link>
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <Link
                component={RouterLink}
                to={"/gallery"}
                sx={{ color: "white" }}
              >
                {"Gallery"}
              </Link>
            </Button>
          </Box>

          {userInfo ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    <Link component={RouterLink} to={"/profile"}>
                      {"Profile"}
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={handleLogout}>
                    {"Logout"}
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Link
                component={RouterLink}
                to="/login"
                sx={{ color: "white", mx: 1 }}
                className="login-register"
              >
                Login
              </Link>
              <Link
                component={RouterLink}
                to="/register"
                sx={{ color: "white", mx: 1 }}
                className="login-register"
              >
                Register
              </Link>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;

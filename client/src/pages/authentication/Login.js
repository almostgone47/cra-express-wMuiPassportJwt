// import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import AuthBanner from "../../components/authentication/AuthBanner";
import { LoginJWT } from "../../components/authentication/login";
import Logo from "../../components/Logo";
import useAuth from "../../hooks/useAuth";
// import gtm from "../../lib/gtm";

const Login = () => {
  const { platform } = useAuth();

  // useEffect(() => {
  //   gtm.push({ event: "page_view" });
  // }, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <AuthBanner />
        <Container maxWidth="sm" sx={{ py: "80px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 8,
            }}
          >
            <RouterLink to="/">
              <Logo
                sx={{
                  height: 40,
                  width: 40,
                }}
              />
            </RouterLink>
          </Box>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 4,
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <div>
                  <Typography color="textPrimary" gutterBottom variant="h4">
                    Log in
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Log in on the internal platform
                  </Typography>
                </div>
                <Box
                  sx={{
                    height: 32,
                    "& > img": {
                      maxHeight: "100%",
                      width: "auto",
                    },
                  }}
                ></Box>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                {platform === "JWT" && <LoginJWT />}
              </Box>
              <Divider sx={{ my: 3 }} />
              <Link
                color="textSecondary"
                component={RouterLink}
                to="/authentication/register-unguarded"
                variant="body2"
              >
                Create new account
              </Link>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;

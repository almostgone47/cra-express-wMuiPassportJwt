import { Box, Container } from "@mui/material";

const AuthBanner = () => (
  <Box
    sx={{
      backgroundColor: "background.paper",
      borderBottom: 1,
      borderColor: "divider",
      py: 2,
    }}
  >
    <Container maxWidth="md">
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            ml: 2,
          }}
        ></Box>
      </Box>
    </Container>
  </Box>
);

export default AuthBanner;

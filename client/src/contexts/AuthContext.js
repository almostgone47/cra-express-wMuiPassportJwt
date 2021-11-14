import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import setAuthToken from "../utils/setAuthToken";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  platform: "JWT",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const jwtToken = window.localStorage.getItem("jwtToken");
        setAuthToken(jwtToken);

        if (jwtToken) {
          const res = await axios
            .get("/api/users/current")
            .catch((err) => console.log("auth err: ", err));

          const user = res.data;

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        if (window.location.pathname !== "/authentication/login") {
          window.location.pathname = "/authentication/login";
        }
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
        return;
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const res = await axios
      .post("/api/users/login", { email, password })
      .catch((err) => {
        toast.error("Unable to Authenticate. " + err.msg);
        console.log("auth err: ", err);
      });

    const { user, jwtToken } = res.data;

    if (jwtToken !== undefined) {
      localStorage.setItem("jwtToken", jwtToken);
      setAuthToken(jwtToken);
    }

    dispatch({
      type: "LOGIN",
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
  };

  const register = async (
    email,
    firstName,
    lastName,
    businessName,
    password
  ) => {
    // const jwtToken = await authApi.register({ email, name, password });
    // const user = await authApi.me(jwtToken);
    const body = { email, firstName, lastName, businessName, password };
    const res = await axios.post("/api/users/register", body).catch((err) => {
      toast.error("Unable to Authenticate. " + err);
      console.log("auth err: ", err);
    });
    const { user, jwtToken } = res.data;

    if (jwtToken !== undefined) {
      localStorage.setItem("jwtToken", jwtToken);
      setAuthToken(jwtToken);
    }

    dispatch({
      type: "REGISTER",
      payload: {
        user,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "JWT",
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;

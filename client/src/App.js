import { useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SplashScreen from "./components/SplashScreen";
import useAuth from "./hooks/useAuth";
import routes from "./routes";

function App() {
  const content = useRoutes(routes);
  const auth = useAuth();
  return (
    <>
      <Toaster position="top-center" />
      {auth.isInitialized ? content : <SplashScreen />}
    </>
  );
}

export default App;

//   /* <Router>
// <div className="App">
//   <Switch>
//     <MainLayout>
//       <Route path={["/overview"]}>
//         <Route exact path="/setup" component={Setup} />
//         <Route exact path="/step" component={Step} />
//         <Route exact path="/tool" component={Tool} />
//         <Route exact path="/overview" component={Overview} />
//       </Route>
//     </MainLayout>
//     <Route path="*" component={Page404} />
//   </Switch>
// </div>
// </Router> */

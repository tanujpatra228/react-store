import { Provider } from "react-redux";
import { BrowserRouter as Router} from "react-router-dom";
import Pages from "./pages/Pages";
import { PersistGate } from 'redux-persist/integration/react';
import store, {persistor} from "./store/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <Pages />
          </Router>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;

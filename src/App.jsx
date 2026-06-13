import { Provider } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import appStore from "./store/store";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import PwaInstallBanner from "./components/PwaInstallBanner";

function App() {
  return (
    <div>
      <Provider store={appStore}>
        <AppRoutes />
        <PwaInstallBanner />
        <Analytics />
        <SpeedInsights />
      </Provider>
    </div>
  );
}

export default App;

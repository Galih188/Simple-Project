import AboutPage from "../pages/about/about-page";
import HomePage from "../pages/home/home-page";

const routes = {
  "/": () => new HomePage(),
  "/about": () => new AboutPage(),
};

export default routes;

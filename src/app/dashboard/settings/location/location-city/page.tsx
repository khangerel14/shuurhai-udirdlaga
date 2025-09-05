import { CONFIG } from 'src/global-config';

import { LocationCityListView } from 'src/sections/location-city/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Байршил - Хот | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <LocationCityListView />;
}

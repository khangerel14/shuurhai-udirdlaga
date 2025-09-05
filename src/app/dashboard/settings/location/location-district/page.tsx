import { CONFIG } from 'src/global-config';

import { LocationDistrictListView } from 'src/sections/location-district/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Байршил - Дүүрэг/Сум | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <LocationDistrictListView />;
}

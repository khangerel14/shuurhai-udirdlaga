import { CONFIG } from 'src/global-config';

import { LocationCommitteeListView } from 'src/sections/location-committee/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Байршил - Баг/Хороо | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <LocationCommitteeListView />;
}

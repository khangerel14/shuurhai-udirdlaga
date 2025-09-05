import { CONFIG } from 'src/global-config';

import { DriverListView } from 'src/sections/driver/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Жолооч | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <DriverListView />;
}

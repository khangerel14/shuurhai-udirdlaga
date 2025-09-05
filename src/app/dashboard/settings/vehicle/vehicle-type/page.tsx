import { CONFIG } from 'src/global-config';

import { VehicleTypeListView } from 'src/sections/vehicle-type/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Тээврийн хэрэгсэлийн төрлийн жагсаалт | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <VehicleTypeListView />;
}

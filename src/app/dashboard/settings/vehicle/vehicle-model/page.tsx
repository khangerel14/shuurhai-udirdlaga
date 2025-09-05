import { CONFIG } from 'src/global-config';

import { VehicleModelListView } from 'src/sections/vehicle-model/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Тээврийн хэрэгсэлийн моделийн жагсаалт | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <VehicleModelListView />;
}

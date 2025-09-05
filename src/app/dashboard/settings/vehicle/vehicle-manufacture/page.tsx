import { CONFIG } from 'src/global-config';

import { VehicleManufactureListView } from 'src/sections/vehicle-manufacture/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Тээврийн хэрэгсэл үйлдвэрлэгчиин жагсаалт | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <VehicleManufactureListView />;
}

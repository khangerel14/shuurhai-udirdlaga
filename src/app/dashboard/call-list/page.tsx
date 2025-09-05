import { CONFIG } from 'src/global-config';

import { CallListView } from 'src/sections/call-list/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Дуудлагагын жагсаалт | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CallListView />;
}

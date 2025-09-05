import { CONFIG } from 'src/global-config';

import { CallListBoardView } from 'src/sections/call/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CallListBoardView />;
}

import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    subheader: 'Үндсэн цэс',
    items: [
      { title: 'Дуудлагын жагсаалт', path: paths.dashboard.callList, icon: ICONS.invoice },
      { title: 'Дуудлага', path: paths.dashboard.call, icon: ICONS.chat },
      { title: 'Хэрэглэгч', path: paths.dashboard.user, icon: ICONS.user },
      { title: 'Жолооч', path: paths.dashboard.driver, icon: ICONS.tour },
      {
        title: 'Тохиргоо',
        path: paths.dashboard.settings.root,
        icon: ICONS.kanban,
        children: [
          {
            title: 'Тээврийн хэрэгсэл',
            path: paths.dashboard.settings.vehicle.root,
            icon: ICONS.product,
            children: [
              {
                title: 'Төрөл',
                path: paths.dashboard.settings.vehicle.vehicleType,
                icon: ICONS.course,
              },
              {
                title: 'Модел',
                path: paths.dashboard.settings.vehicle.vehicleModel,
                icon: ICONS.external,
              },
              {
                title: 'Үйлдвэрлэгч',
                path: paths.dashboard.settings.vehicle.vehicleManufacture,
                icon: ICONS.analytics,
              },
            ],
          },
          {
            title: 'Байршил',
            path: paths.dashboard.settings.location.root,
            icon: ICONS.kanban,
            children: [
              {
                title: 'Хот',
                path: paths.dashboard.settings.location.locationCity,
                icon: ICONS.calendar,
              },
              {
                title: 'Дүүрэг/Сум',
                path: paths.dashboard.settings.location.locationDistrict,
                icon: ICONS.external,
              },
              {
                title: 'Баг/Хороо',
                path: paths.dashboard.settings.location.locationCommittee,
                icon: ICONS.analytics,
              },
            ],
          },
        ],
      },
    ],
  },
];

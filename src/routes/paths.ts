// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    call: `${ROOTS.DASHBOARD}/call`,
    callList: `${ROOTS.DASHBOARD}/call-list`,
    user: `${ROOTS.DASHBOARD}/user`,
    driver: `${ROOTS.DASHBOARD}/driver`,
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
      vehicle: {
        root: `${ROOTS.DASHBOARD}/settings/vehicle`,
        vehicleType: `${ROOTS.DASHBOARD}/settings/vehicle/vehicle-type`,
        vehicleModel: `${ROOTS.DASHBOARD}/settings/vehicle/vehicle-model`,
        vehicleManufacture: `${ROOTS.DASHBOARD}/settings/vehicle/vehicle-manufacture`,
      },
      location: {
        root: `${ROOTS.DASHBOARD}/settings/location`,
        locationCity: `${ROOTS.DASHBOARD}/settings/location/location-city`,
        locationDistrict: `${ROOTS.DASHBOARD}/settings/location/location-district`,
        locationCommittee: `${ROOTS.DASHBOARD}/settings/location/location-committee`,
      },
    },
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};

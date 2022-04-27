// This file allows us to navigate to screens outside of functional components.


import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params=null) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
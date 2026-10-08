// Dedicated high-definition photography for services, specialties, and detail pages
import acRepair from '../assets/media/hero-banner-ac.jpg';
import acCleaning from '../assets/media/poster-ac-jet-cleaning.jpg';
import centralHvac from '../assets/media/case-villa-ducted-ac.jpg';

import fridgeHome from '../assets/media/hero-banner-fridge.jpg';
import fridgeFreezer from '../assets/media/service-fridge-freezer.jpg';
import fridgeColdroom from '../assets/media/case-restaurant-coldroom.jpg';

import motorRewind from '../assets/media/case-industrial-motor.jpg';
import pumpRepair from '../assets/media/service-pump-repair.jpg';
import bearingBrazing from '../assets/media/service-bearing-brazing.jpg';

import contractCorporate from '../assets/media/poster-commercial-hvac-maintenance.jpg';
import contractRestaurant from '../assets/media/service-contract-restaurant.jpg';
import contractVilla from '../assets/media/service-contract-villa.jpg';

import diagnosis from '../assets/media/poster-correct-diagnosis.webp';

export const SPECIALTY_IMAGES = {
  // AC
  'ac-repair': acRepair,
  'ac-cleaning': acCleaning,
  'central-hvac': centralHvac,
  'ac-0': acRepair,
  'ac-1': acCleaning,
  'ac-2': centralHvac,

  // Refrigerator
  'fridge-0': fridgeHome,
  'fridge-1': fridgeFreezer,
  'fridge-2': fridgeColdroom,

  // Motor Rewind
  'motor-0': motorRewind,
  'motor-1': pumpRepair,
  'motor-2': bearingBrazing,

  // Commercial Contracts
  'contract-0': contractCorporate,
  'contract-1': contractRestaurant,
  'contract-2': contractVilla,
};

export const SERVICE_IMAGES = {
  'ac-repair': acRepair,
  'ac-repair-riyadh': acRepair,
  'ac-cleaning': acCleaning,
  'ac-cleaning-installation': acCleaning,
  'central-hvac': centralHvac,
  'central-hvac-maintenance': centralHvac,

  'refrigerator-repair': fridgeHome,
  'refrigerator-freezer-repair': fridgeHome,
  'refrigerator-home': fridgeHome,
  'freezer-defrost-repair': fridgeFreezer,
  'commercial-refrigeration': fridgeColdroom,

  'motor-rewinding': motorRewind,
  'motor-rewinding-welding': motorRewind,
  'water-pump-repair': pumpRepair,
  'motor-bearings-brazing': bearingBrazing,

  'fault-diagnostics': diagnosis,
  'electronic-diagnostics': diagnosis,
  'fault-diagnosis-inspection': diagnosis,

  'maintenance-contracts': contractCorporate,
  'annual-contracts': contractVilla,
  'commercial-maintenance-contracts': contractCorporate,
  'corporate-contracts': contractCorporate,
  'restaurant-contracts': contractRestaurant,
  'villa-contracts': contractVilla,
};

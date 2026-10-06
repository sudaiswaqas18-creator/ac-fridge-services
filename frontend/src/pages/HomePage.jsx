import React from 'react';
import Hero from '../components/Hero.jsx';
import BookingDispatchSection from '../components/BookingDispatchSection.jsx';
import FeaturedShowcase from '../components/FeaturedShowcase.jsx';
import { Services, Features, Marquee, Stats } from '../components/Services.jsx';
import Checker from '../components/Checker.jsx';
import BeforeAfter from '../components/BeforeAfter.jsx';
import { Process } from '../components/Gallery.jsx';
import { Reviews, Faq, Areas } from '../components/Reviews.jsx';
import { Contact } from '../components/Contact.jsx';

export default function HomePage() {
  return (
    <div className="home-page-view">
      <Hero />
      <Marquee />
      <Stats />
      <BookingDispatchSection />
      <FeaturedShowcase />
      <Services />
      <Checker />
      <Features />
      <BeforeAfter />
      <Process />
      <Reviews />
      <Faq />
      <Areas />
      <Contact />
    </div>
  );
}

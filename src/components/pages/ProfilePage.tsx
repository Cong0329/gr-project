import React from 'react';
import { Header } from '../header/Header';
import { Footer } from '../footer/Footer';
import { InformationBody } from '../information/InformationBody';

export const ProfilePage: React.FC = () => {
 
  
  return (
      <div className="flex flex-col min-h-screen">
                    <Header />
                    <InformationBody/>
                    <Footer />
                </div>
    

  )
};



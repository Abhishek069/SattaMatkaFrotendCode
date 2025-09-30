// src/pages/HomePage.jsx
// import React, { useState } from "react";
import Header from '../components/Header';
import WelcomeBanner from "../components/WelcomeBanner";
import InfoSection from "../components/InfoSection";
import LuckyNumberSection from "../components/LuckyNumberSection";
import LiveResultSection from "../components/LiveResultSection";
import NoticeSection from '../components/NoticeSection';
import JodiPannelResultSection from '../components/JodiPannelResultSection'
import MatkaDivisionName from '../components/MatakaDivisionName';
import StarlStarlineSectionineTable from '../components/StarlineSection'
import MainBombay36Bazar from '../components/MainBombay36Bazar'
import DpBossPage from '../components/DpBossPage'
import UserPayments from '../components/AgentList'

const HomePage = (props) => {

  const {setGameTitle} = props

  const role = localStorage.getItem("userRole")
  

  return (
    <div className="border m-1 border-danger text-center py-2 col-10" style={{ backgroundColor: "#ff2600ff", width:"98%" }}>
      <Header />
      <WelcomeBanner />
      <InfoSection />
      {
        role==="Admin" ?
        <UserPayments/>:""
      }
      <LuckyNumberSection />
      <LiveResultSection />
      <NoticeSection/>
      <MatkaDivisionName/>
      <JodiPannelResultSection setGameTitle={setGameTitle}/>
      <StarlStarlineSectionineTable/>
      <MainBombay36Bazar/>
      <DpBossPage/>
    </div>
  );
};

export default HomePage;
